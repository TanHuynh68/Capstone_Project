import { useCallback, useState } from "react";
import { fabric } from "fabric";

export const useFloatingToolbar = (canvasRef: React.RefObject<fabric.Canvas>, canvasElementRef: React.RefObject<HTMLCanvasElement>) => {
    const [toolbarVisible, setToolbarVisible] = useState(false);
    const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });

    const updateToolbarPos = useCallback((obj: fabric.Object) => {
        if (!canvasRef.current || !canvasElementRef.current) return;

        const canvasRect = canvasElementRef.current.getBoundingClientRect();
        const bound = obj.getBoundingRect(true, true);


        setToolbarPos({
            x: canvasRect.left + bound.left + bound.width / 2,
            y: canvasRect.top + bound.top - 60,
        });

        setToolbarVisible(true);
    }, [canvasRef, canvasElementRef]);

    const hideToolbar = useCallback(() => {
        setToolbarVisible(false);
    }, []);

    return {
        toolbarVisible,
        toolbarPos,
        updateToolbarPos,
        hideToolbar,
    };
};
