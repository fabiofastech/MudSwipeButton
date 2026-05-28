// SwipeConfirmButton JS module
// Handles pointer events natively for smooth drag performance.
// All position tracking happens in JS; .NET is called only on swipe complete/cancel.

const _handlers = new WeakMap();

/**
 * Initializes the swipe behavior on the given elements.
 * @param {object} dotNetRef - DotNetObjectReference to the Blazor component
 * @param {HTMLElement} trackEl - The outer pill/track container
 * @param {HTMLElement} thumbEl - The circular draggable thumb
 * @param {number} thresholdPercent - 0-100, how far right to swipe to confirm
 */
export function init(dotNetRef, trackEl, thumbEl, thresholdPercent) {
    let isDragging = false;
    let trackRect = null;

    function getMaxX() {
        // 4px padding on left; thumb starts at left:4px
        return trackRect.width - thumbEl.offsetWidth - 8;
    }

    function onPointerDown(e) {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        e.preventDefault();
        isDragging = true;
        trackRect = trackEl.getBoundingClientRect();
        thumbEl.setPointerCapture(e.pointerId);
        thumbEl.style.transition = 'none';
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        const maxX = getMaxX();
        const relX = e.clientX - trackRect.left - thumbEl.offsetWidth / 2;
        const clampedX = Math.max(0, Math.min(relX, maxX));
        const percent = maxX > 0 ? (clampedX / maxX) * 100 : 0;

        thumbEl.style.transform = `translateX(${clampedX}px)`;

        const label = trackEl.querySelector('.swipe-label');
        if (label) {
            label.style.opacity = Math.max(0, 1 - (percent / 100) * 1.4).toString();
        }

        const arrows = trackEl.querySelector('.swipe-arrows');
        if (arrows) {
            arrows.style.opacity = Math.max(0, 1 - (percent / 100) * 2).toString();
        }
    }

    function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;

        const maxX = getMaxX();
        const relX = e.clientX - trackRect.left - thumbEl.offsetWidth / 2;
        const clampedX = Math.max(0, Math.min(relX, maxX));
        const percent = maxX > 0 ? (clampedX / maxX) * 100 : 0;

        thumbEl.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        if (percent >= thresholdPercent) {
            thumbEl.style.transform = `translateX(${maxX}px)`;
            setTimeout(() => dotNetRef.invokeMethodAsync('JsSwipeCompleted'), 300);
        } else {
            _snapBack(trackEl, thumbEl);
            dotNetRef.invokeMethodAsync('JsSwipeCancelled');
        }
    }

    function onPointerCancel() {
        if (!isDragging) return;
        isDragging = false;
        _snapBack(trackEl, thumbEl);
        dotNetRef.invokeMethodAsync('JsSwipeCancelled');
    }

    thumbEl.addEventListener('pointerdown', onPointerDown);
    thumbEl.addEventListener('pointermove', onPointerMove);
    thumbEl.addEventListener('pointerup', onPointerUp);
    thumbEl.addEventListener('pointercancel', onPointerCancel);

    _handlers.set(thumbEl, { onPointerDown, onPointerMove, onPointerUp, onPointerCancel });
}

export function dispose(thumbEl) {
    const h = _handlers.get(thumbEl);
    if (!h) return;
    thumbEl.removeEventListener('pointerdown', h.onPointerDown);
    thumbEl.removeEventListener('pointermove', h.onPointerMove);
    thumbEl.removeEventListener('pointerup', h.onPointerUp);
    thumbEl.removeEventListener('pointercancel', h.onPointerCancel);
    _handlers.delete(thumbEl);
}

export function reset(trackEl, thumbEl) {
    _snapBack(trackEl, thumbEl);
}

function _snapBack(trackEl, thumbEl) {
    thumbEl.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    thumbEl.style.transform = 'translateX(0px)';
    const label = trackEl.querySelector('.swipe-label');
    if (label) {
        label.style.transition = 'opacity 0.35s ease';
        label.style.opacity = '1';
    }
    const arrows = trackEl.querySelector('.swipe-arrows');
    if (arrows) {
        arrows.style.transition = 'opacity 0.35s ease';
        arrows.style.opacity = '1';
    }
}
