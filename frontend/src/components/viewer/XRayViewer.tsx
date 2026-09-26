import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ToothDetection, FindingItem, SegmentationLayerItem } from '../../types/dental';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Sun, 
  Contrast, 
  Layers, 
  Sliders, 
  Crosshair 
} from 'lucide-react';

interface XRayViewerProps {
  imageUrl: string;
  teeth: ToothDetection[];
  findings: FindingItem[];
  segmentations?: SegmentationLayerItem[] | null;
  selectedFindingId: string | null;
  selectedToothNumber: number | null;
  onSelectFinding: (id: string | null) => void;
  onSelectTooth: (fdi: number | null) => void;
}

export const XRayViewer: React.FC<XRayViewerProps> = ({
  imageUrl,
  teeth,
  findings,
  segmentations = [],
  selectedFindingId,
  selectedToothNumber,
  onSelectFinding,
  onSelectTooth,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Transformação (Pan & Zoom)
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Imagem carregada
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  
  // Filtros radiológicos clínicos
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  
  // Toggles de visualização de camadas
  const [showTeeth, setShowTeeth] = useState(true);
  const [showFindings, setShowFindings] = useState(true);
  const [showSegmentations, setShowSegmentations] = useState(true);
  const showFdi = true;
  const showBoxes = true;
  const showConfidence = true;

  // Mouse coords para retículo
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);

  // Carregar imagem
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      setImageObj(img);
      fitToScreen(img);
    };
  }, [imageUrl]);

  const fitToScreen = useCallback((img?: HTMLImageElement | null) => {
    const targetImg = img || imageObj;
    if (!targetImg || !containerRef.current) return;
    
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    
    const scaleX = (cw - 32) / targetImg.width;
    const scaleY = (ch - 32) / targetImg.height;
    const initScale = Math.min(scaleX, scaleY, 1.0);
    
    setScale(initScale);
    setOffset({
      x: (cw - targetImg.width * initScale) / 2,
      y: (ch - targetImg.height * initScale) / 2
    });
  }, [imageObj]);

  // Se um dente ou achado for selecionado externamente, centralizar nele com zoom suave
  useEffect(() => {
    if (!imageObj || !containerRef.current) return;
    
    let targetBbox: [number, number, number, number] | null = null;
    
    if (selectedFindingId) {
      const f = findings.find(x => x.id === selectedFindingId);
      if (f) targetBbox = f.bbox_normalized;
    } else if (selectedToothNumber) {
      const t = teeth.find(x => x.fdi_number === selectedToothNumber);
      if (t) targetBbox = t.bbox_normalized;
    }

    if (targetBbox) {
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      const [bx, by, bw, bh] = targetBbox;
      
      const targetScale = Math.max(scale, 1.85);
      const imgTargetX = (bx + bw / 2) * imageObj.width;
      const imgTargetY = (by + bh / 2) * imageObj.height;
      
      setScale(targetScale);
      setOffset({
        x: cw / 2 - imgTargetX * targetScale,
        y: ch / 2 - imgTargetY * targetScale
      });
    }
  }, [selectedFindingId, selectedToothNumber]);

  // Renderização Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj || !containerRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Atualizar tamanho do canvas com precisão de densidade
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Aplicar filtros radiológicos
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : ''}`;
    ctx.drawImage(imageObj, 0, 0);
    ctx.filter = 'none';

    const imgW = imageObj.width;
    const imgH = imageObj.height;

    // 0. Desenhar Camadas Anatômicas e Patológicas PRAD (MICCAI Benchmark)
    if (showSegmentations && segmentations && segmentations.length > 0) {
      segmentations.forEach(seg => {
        if (!seg.polygon_normalized || seg.polygon_normalized.length < 3) return;

        const isRelated = selectedFindingId && (
          (selectedFindingId.includes('rcf') && seg.layer === 'root_canal_filling') ||
          (selectedFindingId.includes('lesion') && seg.layer === 'apical_periodontitis') ||
          (selectedFindingId.includes('decay') && seg.layer === 'decay') ||
          (selectedFindingId.includes('bone') && seg.layer === 'alveolar_bone') ||
          (selectedFindingId.includes('rest') && seg.layer === 'dental_filling')
        );

        ctx.save();
        ctx.beginPath();
        seg.polygon_normalized.forEach(([nx, ny], idx) => {
          const px = nx * imgW;
          const py = ny * imgH;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();

        // Preenchimento translúcido com brilho
        ctx.fillStyle = isRelated ? `${seg.color}66` : `${seg.color}28`;
        ctx.fill();

        // Contorno da camada anatômica
        ctx.strokeStyle = isRelated ? '#38bdf8' : seg.color;
        ctx.lineWidth = (isRelated ? 3.0 : 1.6) / scale;
        if (seg.layer === 'alveolar_bone') {
          ctx.setLineDash([6 / scale, 3 / scale]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      });
    }

    // 1. Desenhar Dentes Detectados (FDI)
    if (showTeeth) {
      teeth.forEach(tooth => {
        const [x, y, w, h] = tooth.bbox_normalized;
        const px = x * imgW;
        const py = y * imgH;
        const pw = w * imgW;
        const ph = h * imgH;
        
        const isToothSelected = selectedToothNumber === tooth.fdi_number;

        if (showBoxes) {
          ctx.strokeStyle = isToothSelected ? '#5645d4' : 'rgba(86, 69, 212, 0.4)';
          ctx.lineWidth = isToothSelected ? 3 / scale : 1.4 / scale;
          if (!isToothSelected) {
            ctx.setLineDash([4 / scale, 4 / scale]);
          }
          ctx.strokeRect(px, py, pw, ph);
          ctx.setLineDash([]);

          // Se selecionado, desenhar cantoneiras de foco estilo Notion
          if (isToothSelected) {
            const cornerLen = Math.min(pw, ph) * 0.25;
            ctx.strokeStyle = '#5645d4';
            ctx.lineWidth = 3.5 / scale;
            
            // Top-left
            ctx.beginPath();
            ctx.moveTo(px, py + cornerLen);
            ctx.lineTo(px, py);
            ctx.lineTo(px + cornerLen, py);
            ctx.stroke();

            // Bottom-right
            ctx.beginPath();
            ctx.moveTo(px + pw, py + ph - cornerLen);
            ctx.lineTo(px + pw, py + ph);
            ctx.lineTo(px + pw - cornerLen, py + ph);
            ctx.stroke();
          }
        }

        if (showFdi) {
          // Label do FDI em Badge Notion
          const text = `${tooth.fdi_number}`;
          const fontSize = Math.max(11, Math.min(20, 13 / scale));
          ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
          const textW = ctx.measureText(text).width;
          
          const labelX = px + pw / 2 - textW / 2 - 4;
          const labelY = py - 4;
          const bHeight = fontSize + 4;
          const bWidth = textW + 8;

          ctx.fillStyle = isToothSelected ? '#5645d4' : 'rgba(10, 21, 48, 0.9)';
          ctx.beginPath();
          ctx.roundRect(labelX - 2, labelY - fontSize, bWidth, bHeight, 4 / scale);
          ctx.fill();

          ctx.strokeStyle = isToothSelected ? '#d6b6f6' : 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1 / scale;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, labelX + 2, labelY - 2);
        }

      });
    }

    // 2. Desenhar Achados Radiográficos (OralXrays-9)
    if (showFindings) {
      findings.forEach(finding => {
        if (finding.status === 'rejected') return;

        const [x, y, w, h] = finding.bbox_normalized;
        const px = x * imgW;
        const py = y * imgH;
        const pw = w * imgW;
        const ph = h * imgH;
        
        const isFindingSelected = selectedFindingId === finding.id;

        // Cores específicas por classe do catálogo OralXrays-9
        let strokeColor = '#f59e0b';
        let fillColor = 'rgba(245, 158, 11, 0.16)';
        
        switch (finding.type) {
          case 'apical_periodontitis':
            strokeColor = '#f43f5e'; // Rose vibrante
            fillColor = 'rgba(244, 63, 94, 0.22)';
            break;
          case 'decay':
            strokeColor = '#fb923c'; // Laranja quente
            fillColor = 'rgba(251, 146, 60, 0.22)';
            break;
          case 'wisdom_tooth':
            strokeColor = '#c084fc'; // Violeta
            fillColor = 'rgba(192, 132, 252, 0.20)';
            break;
          case 'missing_tooth':
            strokeColor = '#94a3b8'; // Ardósia
            fillColor = 'rgba(148, 163, 184, 0.15)';
            break;
          case 'dental_filling':
            strokeColor = '#38bdf8'; // Ciano
            fillColor = 'rgba(56, 189, 248, 0.20)';
            break;
          case 'root_canal_filling':
            strokeColor = '#60a5fa'; // Azul
            fillColor = 'rgba(96, 165, 250, 0.20)';
            break;
          case 'implant':
            strokeColor = '#34d399'; // Esmeralda
            fillColor = 'rgba(52, 211, 153, 0.22)';
            break;
          case 'porcelain_crown':
            strokeColor = '#818cf8'; // Índigo
            fillColor = 'rgba(129, 140, 248, 0.20)';
            break;
          case 'ceramic_bridge':
            strokeColor = '#f472b6'; // Pink
            fillColor = 'rgba(244, 114, 182, 0.20)';
            break;
          default:
            if (finding.category === 'pathology') {
              strokeColor = '#f43f5e';
              fillColor = 'rgba(244, 63, 94, 0.20)';
            } else if (finding.category === 'treatment') {
              strokeColor = '#38bdf8';
              fillColor = 'rgba(56, 189, 248, 0.20)';
            }
            break;
        }

        if (isFindingSelected) {
          strokeColor = '#38bdf8';
          fillColor = 'rgba(56, 189, 248, 0.35)';
        }

        ctx.fillStyle = fillColor;
        ctx.fillRect(px, py, pw, ph);

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isFindingSelected ? 3.5 / scale : 2.0 / scale;
        ctx.strokeRect(px, py, pw, ph);

        // Rótulo compacto do achado com tipografia médica moderna
        const shortNames: Record<string, string> = {
          decay: 'Cárie',
          apical_periodontitis: 'Lesão Periapical',
          wisdom_tooth: 'Siso',
          missing_tooth: 'Ausente',
          dental_filling: 'Restauração',
          root_canal_filling: 'Canal',
          implant: 'Implante',
          porcelain_crown: 'Coroa',
          ceramic_bridge: 'Ponte',
        };
        const baseName = shortNames[finding.type] || finding.label.split('—')[0].trim();
        const toothPart = finding.fdi_number ? ` • D${finding.fdi_number}` : '';
        const confPart = showConfidence ? ` ${Math.round(finding.confidence * 100)}%` : '';
        const labelText = `${baseName}${toothPart}${confPart}`;

        const badgeSize = Math.max(10, Math.min(18, 12 / scale));
        ctx.font = `600 ${badgeSize}px "Inter", sans-serif`;
        const bW = ctx.measureText(labelText).width;

        // Fundo do rótulo
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.roundRect(px, py + ph + 2, bW + 8, badgeSize + 6, 2 / scale);
        ctx.fill();

        ctx.fillStyle = '#090a0f';
        ctx.fillText(labelText, px + 4, py + ph + badgeSize + 4);
      });
    }

    ctx.restore();
  }, [
    imageObj,
    scale,
    offset,
    brightness,
    contrast,
    invert,
    showTeeth,
    showFindings,
    showSegmentations,
    teeth,
    findings,
    segmentations,
    selectedFindingId,
    selectedToothNumber
  ]);


  // Manipulação de Mouse: Pan & Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!imageObj || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.2), 8.0);

    const newOffsetX = mouseX - (mouseX - offset.x) * (newScale / scale);
    const newOffsetY = mouseY - (mouseY - offset.y) * (newScale / scale);

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current && imageObj) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const imgX = Math.round((clickX - offset.x) / scale);
      const imgY = Math.round((clickY - offset.y) / scale);
      if (imgX >= 0 && imgX <= imageObj.width && imgY >= 0 && imgY <= imageObj.height) {
        setMouseCoords({ x: imgX, y: imgY });
      } else {
        setMouseCoords(null);
      }
    }

    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Clique no Canvas para selecionar Achado ou Dente
  const handleClick = (e: React.MouseEvent) => {
    if (!imageObj || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const imgX = (clickX - offset.x) / scale;
    const imgY = (clickY - offset.y) / scale;

    const normX = imgX / imageObj.width;
    const normY = imgY / imageObj.height;

    // 1. Prioridade: verificar se clicou em um achado
    const clickedFinding = findings.find(f => {
      if (f.status === 'rejected') return false;
      const [bx, by, bw, bh] = f.bbox_normalized;
      return normX >= bx && normX <= bx + bw && normY >= by && normY <= by + bh;
    });

    if (clickedFinding) {
      onSelectFinding(clickedFinding.id);
      if (clickedFinding.fdi_number) onSelectTooth(clickedFinding.fdi_number);
      return;
    }

    // 2. Verificar se clicou em um dente
    const clickedTooth = teeth.find(t => {
      const [tx, ty, tw, th] = t.bbox_normalized;
      return normX >= tx && normX <= tx + tw && normY >= ty && normY <= ty + th;
    });

    if (clickedTooth) {
      onSelectTooth(clickedTooth.fdi_number);
      onSelectFinding(null);
      return;
    }

    // Clique no vazio
    onSelectFinding(null);
    onSelectTooth(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#070f24] rounded-xl overflow-hidden border border-white/[0.09] shadow-2xl">
      {/* HUD Superior Estilo Notion */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 notion-glass border-b border-white/[0.08] z-20">
        
        {/* Grupo 1: Controles de Zoom & Visualização */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-white/[0.04] p-0.5 rounded-md border border-white/[0.08]">
            <button
              onClick={() => setScale(s => Math.min(s * 1.25, 8.0))}
              className="p-1.5 rounded hover:bg-white/[0.08] text-slate-300 hover:text-slate-100 transition cursor-pointer"
              title="Aproximar (Zoom In)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setScale(s => Math.max(s * 0.8, 0.2))}
              className="p-1.5 rounded hover:bg-white/[0.08] text-slate-300 hover:text-slate-100 transition cursor-pointer"
              title="Afastar (Zoom Out)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-white/[0.08] mx-0.5" />
            <button
              onClick={() => fitToScreen()}
              className="px-2 py-1 text-[11px] font-mono font-medium rounded hover:bg-white/[0.08] text-slate-300 hover:text-[#d6b6f6] transition cursor-pointer flex items-center gap-1"
              title="Ajustar ao Enquadramento"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Ajustar</span>
            </button>
            <button
              onClick={() => {
                setBrightness(100);
                setContrast(100);
                setInvert(false);
                fitToScreen();
              }}
              className="p-1.5 rounded hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title="Resetar Posição e Filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="hidden sm:inline-block px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#7dd3fc] font-tabular">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Grupo 2: Toggles de Camadas Radiológicas */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowTeeth(v => !v)}
            className={`px-2 py-1 text-xs rounded-md font-medium transition cursor-pointer flex items-center gap-1 border ${
              showTeeth
                ? 'bg-white/[0.12] text-slate-100 border-white/[0.2] shadow-sm'
                : 'bg-white/[0.03] text-slate-400 border-transparent hover:text-slate-200'
            }`}
            title="Alternar Deteção dos Dentes"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${showTeeth ? 'bg-[#5645d4]' : 'bg-slate-600'}`} />
            FDI
          </button>

          <button
            onClick={() => setShowFindings(v => !v)}
            className={`px-2 py-1 text-xs rounded-md font-medium transition cursor-pointer flex items-center gap-1 border ${
              showFindings
                ? 'notion-tag-peach border-orange-400/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 border-transparent hover:text-slate-200'
            }`}
            title="Alternar Achados Patológicos e Restauradores"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${showFindings ? 'bg-orange-400 animate-pulse' : 'bg-slate-600'}`} />
            Achados ({findings.filter(f => f.status !== 'rejected').length})
          </button>

          {segmentations && segmentations.length > 0 && (
            <button
              onClick={() => setShowSegmentations(v => !v)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 border ${
                showSegmentations
                  ? 'notion-tag-mint border-emerald-400/40 shadow-sm'
                  : 'bg-white/[0.03] text-slate-400 border-transparent hover:text-slate-200'
              }`}
              title="Segmentação em 9 Camadas Anatômicas (Benchmark PRAD MICCAI)"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRAD 9 Camadas</span>
            </button>
          )}
        </div>

        {/* Grupo 3: Processamento e Filtros Radiológicos */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setInvert(v => !v)}
            className={`px-2.5 py-1 text-xs rounded-md transition cursor-pointer flex items-center gap-1.5 border ${
              invert
                ? 'notion-tag-purple border-[#5645d4]/60 shadow-sm'
                : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08] hover:text-slate-100'
            }`}
            title="Inverter cores (Negativo / Positivo para leitura periapical)"
          >
            <Contrast className="w-3.5 h-3.5 text-[#d6b6f6]" />
            <span className="font-medium">Inverter</span>
          </button>

          {/* Botão de Sliders de Ajuste */}
          <div className="relative">
            <button
              onClick={() => setShowFiltersMenu(v => !v)}
              className={`p-1.5 rounded-md border transition cursor-pointer flex items-center gap-1 ${
                brightness !== 100 || contrast !== 100
                  ? 'notion-tag-sky border-sky-400/40'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-slate-200'
              }`}
              title="Ajuste fino de Brilho e Contraste"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Menu Popover de Sliders */}
            {showFiltersMenu && (
              <div className="absolute right-0 top-9 w-60 p-3 notion-glass-elevated rounded-xl z-30 flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Brilho
                  </span>
                  <span className="font-mono text-[#7dd3fc] font-tabular">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={brightness}
                  onChange={e => setBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#5645d4]"
                />

                <div className="flex items-center justify-between text-slate-300 font-medium mt-1">
                  <span className="flex items-center gap-1.5">
                    <Contrast className="w-3.5 h-3.5 text-[#d6b6f6]" />
                    Contraste
                  </span>
                  <span className="font-mono text-[#7dd3fc] font-tabular">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={contrast}
                  onChange={e => setContrast(Number(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#5645d4]"
                />

                <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center">
                  <button
                    onClick={() => {
                      setBrightness(100);
                      setContrast(100);
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    Redefinir
                  </button>
                  <button
                    onClick={() => setShowFiltersMenu(false)}
                    className="px-2.5 py-1 rounded btn-notion-primary text-[11px] font-medium text-white cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Área Central Interativa do Canvas Darkroom */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className={`relative flex-1 w-full h-full overflow-hidden select-none bg-[#070f24] ${
          isDragging ? 'cursor-grabbing' : 'cursor-crosshair'
        }`}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
        
        {/* HUD Inferior: Coordenadas e Dicas Clínicas */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400 pointer-events-none">
          <div className="px-2.5 py-1 notion-glass rounded-md border border-white/[0.08] flex items-center gap-2">
            <Crosshair className="w-3 h-3 text-[#d6b6f6]" />
            <span>Arraste para mover • Scroll para zoom • Clique no dente/achado</span>
          </div>

          {mouseCoords && (
            <div className="hidden md:flex px-2.5 py-1 notion-glass rounded-md border border-white/[0.08] items-center gap-2 font-tabular">
              <span className="text-slate-500">COORD:</span>
              <span className="text-slate-200">X: {mouseCoords.x}px</span>
              <span className="text-slate-200">Y: {mouseCoords.y}px</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default XRayViewer;
