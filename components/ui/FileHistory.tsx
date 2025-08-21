import { Clock, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileHistoryItem {
  id: string;
  operation: string;
  fileName: string;
  timestamp: Date;
  canRedo: boolean;
}

interface FileHistoryProps {
  items: FileHistoryItem[];
  onRedo?: (id: string) => void;
  onClear?: () => void;
  className?: string;
}

export default function FileHistory({ items, onRedo, onClear, className }: FileHistoryProps) {
  if (items.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted", className)}>
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent operations</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Recent Operations</h3>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-muted hover:text-error transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.operation}
              </p>
              <p className="text-xs text-muted truncate">
                {item.fileName}
              </p>
              <p className="text-xs text-muted">
                {item.timestamp.toLocaleTimeString()}
              </p>
            </div>
            
            {item.canRedo && onRedo && (
              <button
                onClick={() => onRedo(item.id)}
                className="p-1 text-muted hover:text-primary transition-colors"
                title="Redo operation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}