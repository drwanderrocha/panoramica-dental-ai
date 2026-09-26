import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ToothDetection, FindingItem, SegmentationLayerItem } from '../../types/dental';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Sun, Contrast, Layers } from 'lucide-react';

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
  
  // Toggles de visualização de camadas
  const [showTeeth, setShowTeeth] = useState(true);
  const [showFdi, setShowFdi] = useState(true);
  const [showFindings, setShowFindings] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [showSegmentations, setShowSegmentations] = useState(true);

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
      
      const targetScale = Math.max(scale, 1.8);
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

    // Atualizar tamanho do canvas conforme o container
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

        // Preenchimento translúcido da camada
        ctx.fillStyle = isRelated ? `${seg.color}55` : `${seg.color}24`;
        ctx.fill();

        // Contorno da camada
        ctx.strokeStyle = isRelated ? '#fbbf24' : seg.color;
        ctx.lineWidth = (isRelated ? 2.8 : 1.6) / scale;
        if (seg.layer === 'alveolar_bone') {
          ctx.setLineDash([5 / scale, 3 / scale]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      });
    }

    // 1. Desenhar Dentes Detectados
    if (showTeeth) {
      teeth.forEach(tooth => {
        const [x, y, w, h] = tooth.bbox_normalized;
        const px = x * imgW;
        const py = y * imgH;
        const pw = w * imgW;
        const ph = h * imgH;
        
        const isToothSelected = selectedToothNumber === tooth.fdi_number;

        if (showBoxes) {
          ctx.strokeStyle = isToothSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = isToothSelected ? 3 / scale : 1.5 / scale;
          ctx.setLineDash([4 / scale, 4 / scale]);
          ctx.strokeRect(px, py, pw, ph);
          ctx.setLineDash([]);
        }

        if (showFdi) {
          // Label do FDI
          ctx.fillStyle = isToothSelected ? '#0284c7' : 'rgba(15, 23, 42, 0.85)';
          const text = `${tooth.fdi_number}`;
          const fontSize = Math.max(12, Math.min(22, 14 / scale));
          ctx.font = `bold ${fontSize}px sans-serif`;
          const textW = ctx.measureText(text).width;
          
          const labelX = px + pw / 2 - textW / 2 - 4;
          const labelY = py - 4;
          
          ctx.fillRect(labelX - 2, labelY - fontSize, textW + 8, fontSize + 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, labelX + 2, labelY - 2);
        }
      });
    }

    // 2. Desenhar Achados Radiográficos
    if (showFindings) {
      findings.forEach(finding => {
        // Se rejeitado pelo dentista, esmaecer ou não exibir com destaque
        if (finding.status === 'rejected') return;

        const [x, y, w, h] = finding.bbox_normalized;
        const px = x * imgW;
        const py = y * imgH;
        const pw = w * imgW;
        const ph = h * imgH;
        
        const isFindingSelected = selectedFindingId === finding.id;

        // Cores específicas por classe do catálogo OralXrays-9 (CVPR 2025)
        let strokeColor = '#f59e0b';
        let fillColor = 'rgba(245, 158, 11, 0.15)';
        
        switch (finding.type) {
          case 'apical_periodontitis':
            strokeColor = '#ef4444'; // Vermelho vivo
            fillColor = 'rgba(239, 68, 68, 0.20)';
            break;
          case 'decay':
            strokeColor = '#f97316'; // Laranja
            fillColor = 'rgba(249, 115, 22, 0.20)';
            break;
          case 'wisdom_tooth':
            strokeColor = '#a855f7'; // Roxo
            fillColor = 'rgba(168, 85, 247, 0.20)';
            break;
          case 'missing_tooth':
            strokeColor = '#64748b'; // Ardósia
            fillColor = 'rgba(100, 116, 139, 0.20)';
            break;
          case 'dental_filling':
            strokeColor = '#06b6d4'; // Ciano
            fillColor = 'rgba(6, 182, 212, 0.20)';
            break;
          case 'root_canal_filling':
            strokeColor = '#3b82f6'; // Azul royal
            fillColor = 'rgba(59, 130, 246, 0.20)';
            break;
          case 'implant':
            strokeColor = '#10b981'; // Esmeralda
            fillColor = 'rgba(16, 185, 129, 0.20)';
            break;
          case 'porcelain_crown':
            strokeColor = '#6366f1'; // Índigo
            fillColor = 'rgba(99, 102, 241, 0.20)';
            break;
          case 'ceramic_bridge':
            strokeColor = '#ec4899'; // Pink
            fillColor = 'rgba(236, 72, 153, 0.20)';
            break;
          default:
            if (finding.category === 'pathology') {
              strokeColor = '#ef4444';
              fillColor = 'rgba(239, 68, 68, 0.20)';
            } else if (finding.category === 'treatment') {
              strokeColor = '#06b6d4';
              fillColor = 'rgba(6, 182, 212, 0.20)';
            }
            break;
        }

        if (isFindingSelected) {
          strokeColor = '#fbbf24';
          fillColor = 'rgba(251, 191, 36, 0.35)';
        }

        ctx.fillStyle = fillColor;
        ctx.fillRect(px, py, pw, ph);

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isFindingSelected ? 3.5 / scale : 2 / scale;
        ctx.strokeRect(px, py, pw, ph);

        // Rótulo compacto do achado no Canvas
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
        const toothPart = finding.fdi_number ? ` • D ${finding.fdi_number}` : '';
        const confPart = showConfidence ? ` (${Math.round(finding.confidence * 100)}%)` : '';
        const labelText = `${baseName}${toothPart}${confPart}`;

        const badgeSize = Math.max(11, Math.min(18, 12 / scale));
        ctx.font = `600 ${badgeSize}px sans-serif`;
        const bW = ctx.measureText(labelText).width;

        ctx.fillStyle = strokeColor;
        ctx.fillRect(px, py + ph + 2, bW + 8, badgeSize + 6);
        ctx.fillStyle = '#0f172a';
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
    showFdi,
    showFindings,
    showBoxes,
    showConfidence,
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
    if (e.button !== 0) return; // apenas botão esquerdo
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
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

    // Converter coordenada do canvas para coordenada da imagem original [0..1]
    const imgX = (clickX - offset.x) / scale;
    const imgY = (clickY - offset.y) / scale;

    const normX = imgX / imageObj.width;
    const normY = imgY / imageObj.height;

    // 1. Prioridade: verificar se clicou dentro de uma caixa de achado
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
    <div className="relative w-full h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Barra Superior de Ferramentas do Visualizador */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur z-10">
        {/* Controles de Zoom */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setScale(s => Math.min(s * 1.25, 8.0))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale(s => Math.max(s * 0.8, 0.2))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => fitToScreen()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Ajustar à Tela"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setBrightness(100);
              setContrast(100);
              setInvert(false);
              fitToScreen();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Resetar Posição e Filtros"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 ml-1">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Toggles de Camadas (Dentes, FDI, Achados) */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none bg-slate-800/50 px-2 py-1 rounded">
            <input
              type="checkbox"
              checked={showTeeth}
              onChange={e => setShowTeeth(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            Dentes
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none bg-slate-800/50 px-2 py-1 rounded">
            <input
              type="checkbox"
              checked={showFdi}
              onChange={e => setShowFdi(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            FDI
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none bg-slate-800/50 px-2 py-1 rounded font-medium text-amber-400">
            <input
              type="checkbox"
              checked={showFindings}
              onChange={e => setShowFindings(e.target.checked)}
              className="rounded accent-amber-500"
            />
            Achados
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none bg-slate-800/50 px-2 py-1 rounded">
            <input
              type="checkbox"
              checked={showBoxes}
              onChange={e => setShowBoxes(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            Caixas
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none bg-slate-800/50 px-2 py-1 rounded">
            <input
              type="checkbox"
              checked={showConfidence}
              onChange={e => setShowConfidence(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            Score
          </label>
          {segmentations && segmentations.length > 0 && (
            <label className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold cursor-pointer select-none bg-emerald-950/70 border border-emerald-700/80 px-2.5 py-1 rounded shadow-sm">
              <input
                type="checkbox"
                checked={showSegmentations}
                onChange={e => setShowSegmentations(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRAD ({segmentations.length})</span>
            </label>
          )}
        </div>

        {/* Filtros Radiológicos Rápidos */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInvert(v => !v)}
            className={`px-2 py-1 text-xs rounded transition flex items-center gap-1 border ${
              invert
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Inverter tons (Negativo/Positivo radiológico)"
          >
            <Contrast className="w-3.5 h-3.5" />
            Negativo
          </button>
          
          <div className="flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/60">
            <Sun className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min="50"
              max="200"
              value={brightness}
              onChange={e => setBrightness(Number(e.target.value))}
              className="w-16 h-1 accent-cyan-500 cursor-pointer"
              title="Brilho"
            />
          </div>
        </div>
      </div>

      {/* Área Central Interativa do Canvas */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className={`relative flex-1 w-full h-full overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-crosshair'
        }`}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
        
        {/* Dica de navegação no canto inferior */}
        <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-slate-950/80 border border-slate-800/80 rounded-md text-[11px] text-slate-400 backdrop-blur pointer-events-none">
          Arraste para mover • Scroll do mouse para zoom • Clique no dente/achado para inspecionar
        </div>
      </div>
    </div>
  );
};
