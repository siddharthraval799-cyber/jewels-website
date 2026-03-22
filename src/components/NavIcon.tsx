export const NavIcon = ({ label, className = "" }: { label: string; className?: string }) => {
  const content = (() => {
    switch (label.toLowerCase()) {
      case "rings": return <><circle cx="12" cy="15" r="5" /><path d="M12 10L10 7L12 4L14 7L12 10Z" /></>;
      case "earrings": return <><path d="M8 5v5a4 4 0 008 0V5" /><circle cx="8" cy="12" r="2" /><circle cx="16" cy="12" r="2" /></>;
      case "bangles": return <><ellipse cx="12" cy="10" rx="6" ry="3" /><ellipse cx="12" cy="14" rx="6" ry="3" /></>;
      case "pendant set": return <><path d="M5 4c0 0 7 10 7 10s7-10 7-10" /><circle cx="12" cy="16" r="2" /></>;
      case "mangalsutra": return <><path d="M5 6c0 0 7 8 7 8s7-8 7-8" /><circle cx="10" cy="9" r="1.5" /><circle cx="14" cy="9" r="1.5" /><circle cx="12" cy="16" r="2" /></>;
      case "necklace": return <><path d="M5 6c0 0 2 10 7 10s7-10 7-10" /><path d="M7 11v2M9 14v2M12 16v2M15 14v2M17 11v2" /></>;
      case "chains": return <><rect x="6" y="10" width="12" height="4" rx="2" /><rect x="4" y="6" width="6" height="4" rx="2" /><rect x="14" y="6" width="6" height="4" rx="2" /></>;
      case "kids collections": return <><circle cx="12" cy="10" r="4" /><path d="M7 17c0-2.5 10-2.5 10 0" /></>;
      case "mens jewellery": return <><circle cx="12" cy="12" r="5"/><path d="M10 3h4l-1 4h-2l-1-4z"/><path d="M10 21h4l-1-4h-2l-1-4z"/></>;
      case "collections": return <><path d="M4 10l8 10 8-10-4-6-8 0z" /></>;
      case "more jewellery": return <><circle cx="6" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" /></>;
      default: return <circle cx="12" cy="12" r="4" />;
    }
  })();
  return <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={`stroke-current ${className}`}>{content}</svg>;
};
