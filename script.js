// Global state
let textItems = [];
let currentEditingId = null;
let bgImageData = null;
let bgVideoData = null;
let musicData = null;
let musicAudio = null;
let previewTimeline = null;
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
        bgVideo.style.display = 'none';
    }

    function updateGradientBackground() {
        const grad = `linear-gradient(${gradDir.value}, ${gradColor1.value}, ${gradColor2.value})`;
        previewWindow.style.background = grad;
        previewWindow.style.backgroundImage = grad;
        bgVideo.style.display = 'none';
    }

    function updateImageBackground() {
        if (bgImageData) {
            previewWindow.style.backgroundImage = `url(${bgImageData})`;
            previewWindow.style.backgroundSize = bgImageFit.value;
            previewWindow.style.backgroundPosition = 'center';
            previewWindow.style.backgroundRepeat = 'no-repeat';
            previewWindow.style.opacity = bgImageOpacity.value;
            bgVideo.style.display = 'none';
        }
    }

    function updateUrlBackground() {
        if (bgImageData) {
            previewWindow.style.backgroundImage = `url(${bgImageData})`;
            previewWindow.style.backgroundSize = bgUrlFit.value;
            previewWindow.style.backgroundPosition = 'center';
            previewWindow.style.backgroundRepeat = 'no-repeat';
            previewWindow.style.opacity = bgUrlOpacity.value;
            bgVideo.style.display = 'none';
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
            animation: 'creditsScroll',
            duration: 3,
            delay: 0,
            easing: 'none'
        };
        textItems.push(newItem);
        renderTextList();
        openTextEditor(newItem.id);
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

function renderTextList() {
    const textList = document.getElementById('textList');
    textList.innerHTML = '';
    
    textItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'text-item';
        div.innerHTML = `<div class="text-item-content">${item.content.substring(0, 30)}...</div>`;
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

function updatePreview() {
    const container = document.getElementById('textContainer');
    container.innerHTML = '';
    
    textItems.forEach(item => {
        const textEl = document.createElement('div');
        textEl.className = 'text-element';
        textEl.textContent = item.content;
        textEl.style.fontFamily = item.font;
        textEl.style.fontSize = item.size + 'px';
        textEl.style.fontWeight = item.weight;
        textEl.style.color = item.color;
        textEl.style.letterSpacing = item.letterSpacing + 'px';
        textEl.style.lineHeight = item.lineHeight;
        textEl.style.textAlign = item.align;
        
        if (item.shadow) {
            textEl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        }
        
        container.appendChild(textEl);
        
        // Apply animation
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
    
    if (item.shadow) {
        element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    }
    
    switch(item.animation) {
        case 'creditsScroll':
            gsap.set(element, { 
                bottom: '-100px',
                left: '50%',
                xPercent: -50,
                opacity: 1
            });
            gsap.to(element, {
                bottom: '100%',
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
            const text = element.textContent;
            element.textContent = '';
            const chars = text.split('');
            chars.forEach((char, i) => {
                setTimeout(() => {
                    element.textContent += char;
                }, (delay * 1000) + (i * (duration * 1000 / chars.length)));
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
}

async function startExport() {
    const resolution = parseInt(document.getElementById('exportRes').value);
    const fps = parseInt(document.getElementById('exportFps').value);
    const format = document.getElementById('exportFormat').value;
    const progress = document.getElementById('exportProgress');
    
    progress.textContent = 'Loading FFmpeg...';
    
    try {
        const { FFmpeg } = FFmpegWASM;
        const { fetchFile, toBlobURL } = FFmpegUtil;
        const ffmpeg = new FFmpeg();
        
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        
        progress.textContent = 'Rendering frames...';
        
        // Calculate total duration
        let maxTime = 0;
        textItems.forEach(item => {
            const endTime = item.delay + item.duration;
            if (endTime > maxTime) maxTime = endTime;
        });
        
        const totalFrames = Math.ceil(maxTime * fps);
        const canvas = document.createElement('canvas');
        canvas.width = resolution * (16/9);
        canvas.height = resolution;
        const ctx = canvas.getContext('2d');
        
        // Render frames
        for (let i = 0; i < totalFrames; i++) {
            const time = i / fps;
            await renderFrame(ctx, canvas, time);
            
            const blob = await new Promise(resolve => canvas.toBlob(resolve));
            const buffer = await blob.arrayBuffer();
            await ffmpeg.writeFile(`frame${i.toString().padStart(5, '0')}.png`, new Uint8Array(buffer));
            
            progress.textContent = `Rendering: ${Math.round((i / totalFrames) * 100)}%`;
        }
        
        progress.textContent = 'Encoding video...';
        
        // Add music if available
        if (musicData && format === 'mp4') {
            await ffmpeg.writeFile('audio.mp3', await fetchFile(musicData));
            await ffmpeg.exec([
                '-framerate', fps.toString(),
                '-i', 'frame%05d.png',
                '-i', 'audio.mp3',
                '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p',
                '-c:a', 'aac',
                '-shortest',
                'output.mp4'
            ]);
        } else if (format === 'mp4') {
            await ffmpeg.exec([
                '-framerate', fps.toString(),
                '-i', 'frame%05d.png',
                '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p',
                'output.mp4'
            ]);
        } else {
            await ffmpeg.exec([
                '-framerate', fps.toString(),
                '-i', 'frame%05d.png',
                'output.gif'
            ]);
        }
        
        const data = await ffmpeg.readFile(format === 'mp4' ? 'output.mp4' : 'output.gif');
        const url = URL.createObjectURL(new Blob([data.buffer], { 
            type: format === 'mp4' ? 'video/mp4' : 'image/gif' 
        }));
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `credits.${format}`;
        a.click();
        
        progress.textContent = 'Export complete!';
    } catch (error) {
        progress.textContent = 'Export failed: ' + error.message;
        console.error(error);
    }
}

async function renderFrame(ctx, canvas, time) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render background
    const bgType = document.getElementById('bgType').value;
    if (bgType === 'solid') {
        ctx.fillStyle = document.getElementById('bgColor').value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'gradient') {
        const color1 = document.getElementById('gradColor1').value;
        const color2 = document.getElementById('gradColor2').value;
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'image' && bgImageData) {
        const img = await loadImage(bgImageData);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    // Render text
    textItems.forEach(item => {
        if (time >= item.delay && time <= item.delay + item.duration) {
            renderTextOnCanvas(ctx, canvas, item, time);
        }
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function renderTextOnCanvas(ctx, canvas, item, time) {
    const progress = (time - item.delay) / item.duration;
    
    ctx.save();
    ctx.font = `${item.weight} ${item.size}px ${item.font}`;
    ctx.fillStyle = item.color;
    ctx.textAlign = item.align;
    
    if (item.shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }
    
    const x = canvas.width / 2;
    let y = canvas.height / 2;
    
    switch(item.animation) {
        case 'creditsScroll':
            y = canvas.height - (progress * (canvas.height + 100)) + 100;
            break;
        case 'fadeIn':
            ctx.globalAlpha = progress;
            break;
        case 'zoomIn':
            ctx.translate(x, y);
            ctx.scale(progress, progress);
            ctx.translate(-x, -y);
            break;
    }
    
    ctx.fillText(item.content, x, y);
    ctx.restore();
}
