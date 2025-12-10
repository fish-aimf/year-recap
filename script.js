// Global state
let textItems = [];
let currentEditingId = null;
let bgImageData = null;
let bgVideoData = null;
let musicData = null;
let musicAudio = null;
let isPlaying = false;
let startTime = 0;
let currentTime = 0;
let animationFrame = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundControls();
    initTextControls();
    initMusicControls();
    initPreviewControls();
    initExportControls();
});

// Background Controls
function initBackgroundControls() {
    const bgType = document.getElementById('bgType');
    const bgColor = document.getElementById('bgColor');
    const gradColor1 = document.getElementById('gradColor1');
    const gradColor2 = document.getElementById('gradColor2');
    const gradDir = document.getElementById('gradDir');
    const bgImageFile = document.getElementById('bgImageFile');
    const bgImageFit = document.getElementById('bgImageFit');
    const bgImageOpacity = document.getElementById('bgImageOpacity');
    const bgImageUrl = document.getElementById('bgImageUrl');
    const loadUrlBtn = document.getElementById('loadUrlBtn');
    const bgUrlFit = document.getElementById('bgUrlFit');
    const bgUrlOpacity = document.getElementById('bgUrlOpacity');
    const bgVideoFile = document.getElementById('bgVideoFile');
    const bgVideoLoop = document.getElementById('bgVideoLoop');
    const bgVideoOpacity = document.getElementById('bgVideoOpacity');
    const bgVideoBlur = document.getElementById('bgVideoBlur');
    const previewWindow = document.getElementById('previewWindow');
    const bgVideo = document.getElementById('bgVideo');

    bgType.addEventListener('change', () => {
        document.querySelectorAll('.bg-controls').forEach(el => el.classList.add('hidden'));
        bgVideo.style.display = 'none';
        
        if (bgType.value === 'solid') {
            document.getElementById('solidControls').classList.remove('hidden');
            updateSolidBackground();
        } else if (bgType.value === 'gradient') {
            document.getElementById('gradientControls').classList.remove('hidden');
            updateGradientBackground();
        } else if (bgType.value === 'image') {
            document.getElementById('imageControls').classList.remove('hidden');
        } else if (bgType.value === 'url') {
            document.getElementById('urlControls').classList.remove('hidden');
        } else if (bgType.value === 'video') {
            document.getElementById('videoControls').classList.remove('hidden');
        }
    });

    bgColor.addEventListener('input', updateSolidBackground);
    gradColor1.addEventListener('input', updateGradientBackground);
    gradColor2.addEventListener('input', updateGradientBackground);
    gradDir.addEventListener('change', updateGradientBackground);

    bgImageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                bgImageData = event.target.result;
                updateImageBackground();
            };
            reader.readAsDataURL(file);
        }
    });

    bgImageFit.addEventListener('change', updateImageBackground);
    bgImageOpacity.addEventListener('input', updateImageBackground);

    loadUrlBtn.addEventListener('click', () => {
        const url = bgImageUrl.value.trim();
        if (url) {
            bgImageData = url;
            updateUrlBackground();
        }
    });

    bgUrlFit.addEventListener('change', updateUrlBackground);
    bgUrlOpacity.addEventListener('input', updateUrlBackground);

    bgVideoFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                bgVideoData = event.target.result;
                bgVideo.src = bgVideoData;
                bgVideo.style.display = 'block';
                updateVideoBackground();
            };
            reader.readAsDataURL(file);
        }
    });

    bgVideoLoop.addEventListener('change', () => {
        bgVideo.loop = bgVideoLoop.checked;
    });

    bgVideoOpacity.addEventListener('input', updateVideoBackground);
    bgVideoBlur.addEventListener('input', updateVideoBackground);

    function updateSolidBackground() {
        previewWindow.style.background = bgColor.value;
        previewWindow.style.backgroundImage = 'none';
    }

    function updateGradientBackground() {
        const grad = `linear-gradient(${gradDir.value}, ${gradColor1.value}, ${gradColor2.value})`;
        previewWindow.style.background = grad;
        previewWindow.style.backgroundImage = grad;
    }

    function updateImageBackground() {
        if (bgImageData) {
            previewWindow.style.backgroundImage = `url(${bgImageData})`;
            previewWindow.style.backgroundSize = bgImageFit.value;
            previewWindow.style.backgroundPosition = 'center';
            previewWindow.style.backgroundRepeat = 'no-repeat';
            previewWindow.style.opacity = bgImageOpacity.value;
        }
    }

    function updateUrlBackground() {
        if (bgImageData) {
            previewWindow.style.backgroundImage = `url(${bgImageData})`;
            previewWindow.style.backgroundSize = bgUrlFit.value;
            previewWindow.style.backgroundPosition = 'center';
            previewWindow.style.backgroundRepeat = 'no-repeat';
            previewWindow.style.opacity = bgUrlOpacity.value;
        }
    }

    function updateVideoBackground() {
        bgVideo.style.opacity = bgVideoOpacity.value;
        bgVideo.style.filter = `blur(${bgVideoBlur.value}px)`;
    }
}

// Text Controls
function initTextControls() {
    const addTextBtn = document.getElementById('addTextBtn');
    const textEditorModal = document.getElementById('textEditorModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const saveTextBtn = document.getElementById('saveTextBtn');
    const deleteTextBtn = document.getElementById('deleteTextBtn');
    const autoFillBtn = document.getElementById('autoFillBtn');
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const colorBtn = document.getElementById('colorBtn');
    const textColorPicker = document.getElementById('textColorPicker');

    addTextBtn.addEventListener('click', () => {
        const newItem = {
            id: Date.now(),
            content: 'New Text',
            font: 'Arial',
            size: 32,
            weight: 'normal',
            color: '#ffffff',
            letterSpacing: 0,
            lineHeight: 1.5,
            align: 'center',
            shadow: false,
            outline: false,
            outlineColor: '#000000',
            animation: 'creditsScroll',
            duration: 10,
            delay: 0,
            easing: 'none'
        };
        textItems.push(newItem);
        renderTextList();
        openTextEditor(newItem.id);
    });

    autoFillBtn.addEventListener('click', () => {
        const exampleText = `<b>2025 Summary</b>

Meals eaten: 1096
Money saved: $9112
Average daily sleep: 5h
Average daily screentime: 10h
New friends made: 20
Girls talked to: 1 (mom)`;
        document.getElementById('editTextContent').value = exampleText;
    });

    boldBtn.addEventListener('click', () => wrapSelection('<b>', '</b>'));
    italicBtn.addEventListener('click', () => wrapSelection('<i>', '</i>'));
    colorBtn.addEventListener('click', () => {
        const color = textColorPicker.value;
        wrapSelection(`<span style="color:${color}">`, '</span>');
    });

    closeModalBtn.addEventListener('click', () => {
        textEditorModal.classList.add('hidden');
    });

    saveTextBtn.addEventListener('click', () => {
        saveCurrentText();
        textEditorModal.classList.add('hidden');
        renderTextList();
        updatePreview();
    });

    deleteTextBtn.addEventListener('click', () => {
        textItems = textItems.filter(item => item.id !== currentEditingId);
        textEditorModal.classList.add('hidden');
        renderTextList();
        updatePreview();
    });
}

function wrapSelection(start, end) {
    const textarea = document.getElementById('editTextContent');
    const selStart = textarea.selectionStart;
    const selEnd = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(selStart, selEnd);
    
    if (selected) {
        const newText = text.substring(0, selStart) + start + selected + end + text.substring(selEnd);
        textarea.value = newText;
        textarea.selectionStart = selStart + start.length;
        textarea.selectionEnd = selEnd + start.length;
    }
    textarea.focus();
}

function renderTextList() {
    const textList = document.getElementById('textList');
    textList.innerHTML = '';
    
    textItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'text-item';
        const preview = item.content.replace(/<[^>]*>/g, '').substring(0, 30);
        div.innerHTML = `<div class="text-item-content">${preview}...</div>`;
        div.addEventListener('click', () => openTextEditor(item.id));
        textList.appendChild(div);
    });
}

function openTextEditor(id) {
    currentEditingId = id;
    const item = textItems.find(t => t.id === id);
    if (!item) return;

    document.getElementById('editTextContent').value = item.content;
    document.getElementById('editFont').value = item.font;
    document.getElementById('editSize').value = item.size;
    document.getElementById('editWeight').value = item.weight;
    document.getElementById('editColor').value = item.color;
    document.getElementById('editLetterSpacing').value = item.letterSpacing;
    document.getElementById('editLineHeight').value = item.lineHeight;
    document.getElementById('editAlign').value = item.align;
    document.getElementById('editShadow').checked = item.shadow;
    document.getElementById('editOutline').checked = item.outline || false;
    document.getElementById('editOutlineColor').value = item.outlineColor || '#000000';
    document.getElementById('editAnimation').value = item.animation;
    document.getElementById('editDuration').value = item.duration;
    document.getElementById('editDelay').value = item.delay;
    document.getElementById('editEasing').value = item.easing;

    document.getElementById('textEditorModal').classList.remove('hidden');
}

function saveCurrentText() {
    const item = textItems.find(t => t.id === currentEditingId);
    if (!item) return;

    item.content = document.getElementById('editTextContent').value;
    item.font = document.getElementById('editFont').value;
    item.size = parseInt(document.getElementById('editSize').value);
    item.weight = document.getElementById('editWeight').value;
    item.color = document.getElementById('editColor').value;
    item.letterSpacing = parseFloat(document.getElementById('editLetterSpacing').value);
    item.lineHeight = parseFloat(document.getElementById('editLineHeight').value);
    item.align = document.getElementById('editAlign').value;
    item.shadow = document.getElementById('editShadow').checked;
    item.outline = document.getElementById('editOutline').checked;
    item.outlineColor = document.getElementById('editOutlineColor').value;
    item.animation = document.getElementById('editAnimation').value;
    item.duration = parseFloat(document.getElementById('editDuration').value);
    item.delay = parseFloat(document.getElementById('editDelay').value);
    item.easing = document.getElementById('editEasing').value;
}

// Music Controls
function initMusicControls() {
    const musicFile = document.getElementById('musicFile');
    const musicVolume = document.getElementById('musicVolume');

    musicFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                musicData = event.target.result;
                if (musicAudio) {
                    musicAudio.pause();
                }
                musicAudio = new Audio(musicData);
                musicAudio.volume = parseFloat(musicVolume.value);
            };
            reader.readAsDataURL(file);
        }
    });

    musicVolume.addEventListener('input', () => {
        if (musicAudio) {
            musicAudio.volume = parseFloat(musicVolume.value);
        }
    });
}

// Preview Controls
function initPreviewControls() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');

    playBtn.addEventListener('click', playPreview);
    pauseBtn.addEventListener('click', pausePreview);
    restartBtn.addEventListener('click', restartPreview);
}

function playPreview() {
    if (!isPlaying) {
        isPlaying = true;
        startTime = Date.now() - currentTime;
        updatePreview();
        
        if (musicAudio) {
            const musicStart = parseFloat(document.getElementById('musicStart').value) || 0;
            musicAudio.currentTime = musicStart + (currentTime / 1000);
            musicAudio.play();
        }
        
        const bgVideo = document.getElementById('bgVideo');
        if (bgVideo.src) {
            bgVideo.play();
        }
        
        animatePreview();
    }
}

function pausePreview() {
    isPlaying = false;
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    if (musicAudio) {
        musicAudio.pause();
    }
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo.src) {
        bgVideo.pause();
    }
}

function restartPreview() {
    pausePreview();
    currentTime = 0;
    updatePreview();
    playPreview();
}

function animatePreview() {
    if (!isPlaying) return;
    
    currentTime = Date.now() - startTime;
    document.getElementById('timeDisplay').textContent = (currentTime / 1000).toFixed(1) + 's';
    
    animationFrame = requestAnimationFrame(animatePreview);
}

function parseStyledText(text) {
    return text
        .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
        .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function updatePreview() {
    const container = document.getElementById('textContainer');
    container.innerHTML = '';
    
    textItems.forEach(item => {
        const textEl = document.createElement('div');
        textEl.className = 'text-element';
        textEl.innerHTML = parseStyledText(item.content);
        textEl.style.fontFamily = item.font;
        textEl.style.fontSize = item.size + 'px';
        textEl.style.fontWeight = item.weight;
        textEl.style.color = item.color;
        textEl.style.letterSpacing = item.letterSpacing + 'px';
        textEl.style.lineHeight = item.lineHeight;
        textEl.style.textAlign = item.align;
        textEl.style.whiteSpace = 'pre-wrap';
        
        if (item.shadow) {
            textEl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        }
        
        if (item.outline) {
            textEl.style.webkitTextStroke = `2px ${item.outlineColor}`;
            textEl.style.paintOrder = 'stroke fill';
        }
        
        container.appendChild(textEl);
        applyAnimation(textEl, item);
    });
}

function applyAnimation(element, item) {
    const delay = item.delay;
    const duration = item.duration;
    const easing = item.easing;
    
    gsap.set(element, { clearProps: 'all' });
    element.style.fontFamily = item.font;
    element.style.fontSize = item.size + 'px';
    element.style.fontWeight = item.weight;
    element.style.color = item.color;
    element.style.letterSpacing = item.letterSpacing + 'px';
    element.style.lineHeight = item.lineHeight;
    element.style.textAlign = item.align;
    element.style.whiteSpace = 'pre-wrap';
    
    if (item.shadow) {
        element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    }
    
    if (item.outline) {
        element.style.webkitTextStroke = `2px ${item.outlineColor}`;
        element.style.paintOrder = 'stroke fill';
    }
    
    switch(item.animation) {
        case 'creditsScroll':
            gsap.set(element, { 
                top: '100%',
                left: '50%',
                xPercent: -50,
                opacity: 1
            });
            gsap.to(element, {
                top: '-100%',
                duration: duration,
                delay: delay,
                ease: easing || 'none'
            });
            break;
            
        case 'slideLeft':
            gsap.set(element, { 
                x: '-100%',
                left: 0,
                top: '50%',
                yPercent: -50,
                opacity: 1
            });
            gsap.to(element, {
                x: '0%',
                duration: duration,
                delay: delay,
                ease: easing || 'power1.out'
            });
            break;
            
        case 'slideRight':
            gsap.set(element, { 
                x: '100%',
                right: 0,
                top: '50%',
                yPercent: -50,
                opacity: 1
            });
            gsap.to(element, {
                x: '0%',
                duration: duration,
                delay: delay,
                ease: easing || 'power1.out'
            });
            break;
            
        case 'fadeIn':
            gsap.set(element, { 
                opacity: 0,
                left: '50%',
                top: '50%',
                xPercent: -50,
                yPercent: -50
            });
            gsap.to(element, {
                opacity: 1,
                duration: duration,
                delay: delay,
                ease: easing || 'none'
            });
            break;
            
        case 'fadeInOut':
            gsap.set(element, { 
                opacity: 0,
                left: '50%',
                top: '50%',
                xPercent: -50,
                yPercent: -50
            });
            gsap.to(element, {
                opacity: 1,
                duration: duration / 2,
                delay: delay,
                ease: easing || 'none'
            });
            gsap.to(element, {
                opacity: 0,
                duration: duration / 2,
                delay: delay + duration / 2,
                ease: easing || 'none'
            });
            break;
            
        case 'typewriter':
            gsap.set(element, { 
                left: '50%',
                top: '50%',
                xPercent: -50,
                yPercent: -50,
                opacity: 1
            });
            break;
            
        case 'zoomIn':
            gsap.set(element, { 
                scale: 0,
                left: '50%',
                top: '50%',
                xPercent: -50,
                yPercent: -50,
                opacity: 1
            });
            gsap.to(element, {
                scale: 1,
                duration: duration,
                delay: delay,
                ease: easing || 'power1.out'
            });
            break;
            
        case 'zoomOut':
            gsap.set(element, { 
                scale: 3,
                left: '50%',
                top: '50%',
                xPercent: -50,
                yPercent: -50,
                opacity: 1
            });
            gsap.to(element, {
                scale: 1,
                duration: duration,
                delay: delay,
                ease: easing || 'power1.out'
            });
            break;
    }
}

// Export Controls
function initExportControls() {
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', startExport);
    
    // NEW: Listen for resolution changes
    const exportRes = document.getElementById('exportRes');
    exportRes.addEventListener('change', updatePreviewAspectRatio);
    
    // Initialize aspect ratio on load
    updatePreviewAspectRatio();
}
function updatePreviewAspectRatio() {
    const resolutionVal = document.getElementById('exportRes').value;
    const previewWindow = document.getElementById('previewWindow');
    
    previewWindow.classList.remove('aspect-16-9', 'aspect-9-16', 'aspect-4-3');
    
    if (resolutionVal === 'shorts' || resolutionVal === 'instagram') {
        previewWindow.classList.add('aspect-9-16');
    } else if (resolutionVal === '720' || resolutionVal === '1080') {
        previewWindow.classList.add('aspect-16-9');
    }
}

async function startExport() {
    const resolutionVal = document.getElementById('exportRes').value;
    const fps = parseInt(document.getElementById('exportFps').value);
    const progress = document.getElementById('exportProgress');
    const exportBtn = document.getElementById('exportBtn');
    
    exportBtn.disabled = true;
    progress.textContent = 'Initializing...';
    
    try {
        // Calculate duration
        let maxEndTime = 0;
        textItems.forEach(item => {
            const endTime = item.delay + item.duration;
            if (endTime > maxEndTime) maxEndTime = endTime;
        });
        
        const totalDuration = Math.max(maxEndTime + 1, 5);
        let width, height;
        
        if (resolutionVal === 'shorts' || resolutionVal === 'instagram') {
            width = 1080;
            height = 1920;
        } else if (resolutionVal === '720') {
            width = 1280;
            height = 720;
        } else {
            width = 1920;
            height = 1080;
        }
        
        const totalFrames = Math.ceil(totalDuration * fps);
        
        // Pre-load background image
        let bgImage = null;
        const bgType = document.getElementById('bgType').value;
        if ((bgType === 'image' || bgType === 'url') && bgImageData) {
            progress.textContent = 'Loading background...';
            bgImage = await loadImage(bgImageData);
        }
        
        // Create canvas for rendering
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: false });
        
        // Setup video stream with FIXED frame rate
        progress.textContent = 'Starting encoder...';
        const stream = canvas.captureStream(fps); // CRITICAL: Pass fps here
        const videoTrack = stream.getVideoTracks()[0];
        
        // Setup audio if exists
        let finalStream = stream;
        if (musicAudio && musicData) {
            try {
                const audioContext = new AudioContext();
                const source = audioContext.createMediaElementSource(musicAudio);
                const destination = audioContext.createMediaStreamDestination();
                source.connect(destination);
                source.connect(audioContext.destination);
                
                const audioTrack = destination.stream.getAudioTracks()[0];
                finalStream = new MediaStream([videoTrack, audioTrack]);
                
                // Reset audio to start position
                const musicStart = parseFloat(document.getElementById('musicStart').value) || 0;
                musicAudio.currentTime = musicStart;
            } catch (e) {
                console.warn('Audio setup failed, proceeding without audio:', e);
                finalStream = stream;
            }
        }
        
        // Create MediaRecorder
        const chunks = [];
        let mimeType = 'video/webm;codecs=vp9,opus';
        
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm;codecs=vp8,opus';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm';
        }
        
        const recorder = new MediaRecorder(finalStream, {
            mimeType: mimeType,
            videoBitsPerSecond: 5000000,
        });
        
        recorder.ondataavailable = e => {
            if (e.data.size > 0) chunks.push(e.data);
        };
        
        const recordingDone = new Promise(resolve => {
            recorder.onstop = resolve;
        });
        
        // Start recording
        recorder.start();
        
        // CRITICAL: Start audio AFTER recorder starts
        if (musicAudio && musicData) {
            await musicAudio.play().catch(e => console.warn('Audio play failed:', e));
        }
        
        // Render frames at exact intervals
        progress.textContent = 'Rendering frames...';
        const frameDuration = 1000 / fps;
        
        for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
            const frameStart = performance.now();
            const time = frameNum / fps;
            
            // Render this frame to canvas
            await renderFrameToCanvas(ctx, canvas, time, width, height, bgImage);
            
            // Update progress
            if (frameNum % 10 === 0) {
                const percent = Math.round((frameNum / totalFrames) * 100);
                progress.textContent = `Rendering: ${percent}% (${frameNum}/${totalFrames} frames)`;
                await new Promise(r => setTimeout(r, 0)); // Let UI update
            }
            
            // Wait for next frame time
            const elapsed = performance.now() - frameStart;
            const waitTime = Math.max(0, frameDuration - elapsed);
            await new Promise(r => setTimeout(r, waitTime));
        }
        
        // Stop everything
        progress.textContent = 'Finalizing video...';
        
        if (musicAudio) {
            musicAudio.pause();
            musicAudio.currentTime = 0;
        }
        
        // Wait a bit for final frames
        await new Promise(r => setTimeout(r, 1000));
        recorder.stop();
        await recordingDone;
        
        // Download
        const blob = new Blob(chunks, { type: 'video/webm' });
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        downloadBlob(blob, `credits-${width}x${height}-${fps}fps.webm`);
        
        progress.textContent = `✓ Complete! ${totalFrames} frames, ${sizeMB}MB`;
        exportBtn.disabled = false;
        
    } catch (error) {
        console.error('Export error:', error);
        progress.textContent = '✗ Export failed: ' + error.message;
        exportBtn.disabled = false;
        
        if (musicAudio) {
            musicAudio.pause();
            musicAudio.currentTime = 0;
        }
    }
}
async function renderFrameToCanvas(ctx, canvas, time, width, height, bgImage = null) {
    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Background
    const bgType = document.getElementById('bgType').value;
    
    if (bgType === 'solid') {
        ctx.fillStyle = document.getElementById('bgColor').value;
        ctx.fillRect(0, 0, width, height);
    } else if (bgType === 'gradient') {
        const c1 = document.getElementById('gradColor1').value;
        const c2 = document.getElementById('gradColor2').value;
        const dir = document.getElementById('gradDir').value;
        
        let gradient;
        if (dir === 'to bottom' || dir === '180deg') {
            gradient = ctx.createLinearGradient(0, 0, 0, height);
        } else if (dir === 'to right' || dir === '90deg') {
            gradient = ctx.createLinearGradient(0, 0, width, 0);
        } else if (dir === 'to top' || dir === '0deg') {
            gradient = ctx.createLinearGradient(0, height, 0, 0);
        } else {
            gradient = ctx.createLinearGradient(width, 0, 0, 0);
        }
        
        gradient.addColorStop(0, c1);
        gradient.addColorStop(1, c2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    } else if ((bgType === 'image' || bgType === 'url') && bgImage) {
        const fit = bgType === 'image' ? 
            document.getElementById('bgImageFit').value : 
            document.getElementById('bgUrlFit').value;
        
        drawImageWithFit(ctx, bgImage, width, height, fit);
    }
    
    // Render text
    textItems.forEach(item => {
        const startTime = item.delay;
        const endTime = item.delay + item.duration;
        
        if (time >= startTime && time <= endTime) {
            const progress = (time - startTime) / item.duration;
            renderTextItem(ctx, item, progress, width, height);
        }
    });
}

function drawImageWithFit(ctx, img, canvasWidth, canvasHeight, fit) {
    const imgAspect = img.width / img.height;
    const canvasAspect = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (fit === 'cover') {
        if (imgAspect > canvasAspect) {
            drawHeight = canvasHeight;
            drawWidth = drawHeight * imgAspect;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvasWidth;
            drawHeight = drawWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        }
    } else if (fit === 'contain') {
        if (imgAspect > canvasAspect) {
            drawWidth = canvasWidth;
            drawHeight = drawWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        } else {
            drawHeight = canvasHeight;
            drawWidth = drawHeight * imgAspect;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        }
    } else {
        drawWidth = canvasWidth;
        drawHeight = canvasHeight;
        offsetX = 0;
        offsetY = 0;
    }
    
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function renderTextItem(ctx, item, progress, width, height) {
    ctx.save();
    
    const lines = item.content.split('\n');
    const fontWeight = item.weight;
    const fontSize = item.size;
    const fontFamily = item.font;
    
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = item.color;
    
    if (item.shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }
    
    if (item.outline) {
        ctx.strokeStyle = item.outlineColor;
        ctx.lineWidth = 4;
    }
    
    let baseX, baseY;
    let opacity = 1;
    let scale = 1;
    
    switch(item.animation) {
        case 'creditsScroll':
            const scrollStart = height + 100;
            const scrollEnd = -500;
            baseY = scrollStart - (progress * (scrollStart - scrollEnd));
            baseX = width / 2;
            ctx.textAlign = 'center';
            break;
            
        case 'fadeIn':
            baseX = width / 2;
            baseY = height / 2;
            opacity = progress;
            ctx.textAlign = 'center';
            break;
            
        case 'fadeInOut':
            baseX = width / 2;
            baseY = height / 2;
            opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
            ctx.textAlign = 'center';
            break;
            
        case 'slideLeft':
            baseX = width * (1 - progress);
            baseY = height / 2;
            ctx.textAlign = 'left';
            break;
            
        case 'slideRight':
            baseX = width * progress;
            baseY = height / 2;
            ctx.textAlign = 'right';
            break;
            
        case 'zoomIn':
            baseX = width / 2;
            baseY = height / 2;
            scale = progress;
            ctx.textAlign = 'center';
            break;
            
        case 'zoomOut':
            baseX = width / 2;
            baseY = height / 2;
            scale = 3 - (progress * 2);
            ctx.textAlign = 'center';
            break;
            
        default:
            baseX = width / 2;
            baseY = height / 2;
            ctx.textAlign = item.align;
    }
    
    ctx.globalAlpha = opacity;
    
    if (scale !== 1) {
        ctx.translate(baseX, baseY);
        ctx.scale(scale, scale);
        ctx.translate(-baseX, -baseY);
    }
    
    const lineHeight = fontSize * item.lineHeight;
    const totalHeight = lines.length * lineHeight;
    
    if (item.animation !== 'creditsScroll') {
        baseY = baseY - (totalHeight / 2) + (fontSize / 2);
    }
    
    lines.forEach((line, i) => {
        const y = baseY + (i * lineHeight);
        const segments = parseLineSegments(line);
        
        let currentX = baseX;
        
        if (ctx.textAlign === 'center') {
            const totalWidth = segments.reduce((sum, seg) => {
                ctx.font = `${seg.bold ? 'bold' : fontWeight} ${seg.italic ? 'italic' : ''} ${fontSize}px ${fontFamily}`.trim();
                return sum + ctx.measureText(seg.text).width;
            }, 0);
            currentX = baseX - (totalWidth / 2);
        } else if (ctx.textAlign === 'right') {
            const totalWidth = segments.reduce((sum, seg) => {
                ctx.font = `${seg.bold ? 'bold' : fontWeight} ${seg.italic ? 'italic' : ''} ${fontSize}px ${fontFamily}`.trim();
                return sum + ctx.measureText(seg.text).width;
            }, 0);
            currentX = baseX - totalWidth;
        }
        
        segments.forEach(seg => {
            ctx.font = `${seg.bold ? 'bold' : fontWeight} ${seg.italic ? 'italic' : ''} ${fontSize}px ${fontFamily}`.trim();
            ctx.fillStyle = seg.color || item.color;
            
            if (item.outline) {
                ctx.strokeText(seg.text, currentX, y);
            }
            ctx.fillText(seg.text, currentX, y);
            
            currentX += ctx.measureText(seg.text).width;
        });
    });
    
    ctx.restore();
}

function parseLineSegments(line) {
    const segments = [];
    let currentText = '';
    let bold = false;
    let italic = false;
    let color = null;
    let i = 0;
    
    while (i < line.length) {
        if (line.substr(i, 3) === '<b>') {
            if (currentText) {
                segments.push({ text: currentText, bold, italic, color });
                currentText = '';
            }
            bold = true;
            i += 3;
        } else if (line.substr(i, 4) === '</b>') {
            if (currentText) {
                segments.push({ text: currentText, bold, italic, color });
                currentText = '';
            }
            bold = false;
            i += 4;
        } else if (line.substr(i, 3) === '<i>') {
            if (currentText) {
                segments.push({ text: currentText, bold, italic, color });
                currentText = '';
            }
            italic = true;
            i += 3;
        } else if (line.substr(i, 4) === '</i>') {
            if (currentText) {
                segments.push({ text: currentText, bold, italic, color });
                currentText = '';
            }
            italic = false;
            i += 4;
        } else if (line.substr(i, 18) === '<span style="color') {
            if (currentText) {
                segments.push({ text: currentText, bold, italic, color });
                currentText = '';
            }
            const colorMatch = line.substr(i).match(/color:([^"]+)"/);
            if (colorMatch) {
                color = colorMatch[1];
                i = line.indexOf('>', i) + 1;
            } else {
                currentText += line[i];
                i++;
            }
        } else if (line.substr(i, 7) === '</span>') {
            if (currentText) {
                segments.push({ text: currentText, bold, italic, color });
                currentText = '';
            }
            color = null;
            i += 7;
        } else {
            currentText += line[i];
            i++;
        }
    }
    
    if (currentText) {
        segments.push({ text: currentText, bold, italic, color });
    }
    
    return segments.length ? segments : [{ text: line, bold: false, italic: false, color: null }];
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
