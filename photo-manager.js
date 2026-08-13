/* ============================================================
   PHOTO MANAGER - Sistema de gerenciamento de múltiplas fotos
   ============================================================ */

class PhotoManager {
    constructor() {
        this.photos = [];
        this.selectedPhotoIndex = null;
        this.imageGallery = $('#modalImageGallery');
        this.imageCount = $('#imageCount');
        this.imageDropZone = $('#imageDropZone');
        this.modalImageFile = $('#modalImageFile');
        this.modalImageUrl = $('#modalImageUrl');
        this.editorCanvas = $('#editorCanvas');
        this.imageEditorGroup = $('#imageEditorGroup');
        this.btnAddImageUrl = $('#btnAddImageUrl');
        this.btnCancelModal = $('#btnCancelModal');
        
        // Editor
        this.editorState = {
            rotation: 0,
            zoom: 1,
            brightness: 1,
            contrast: 1
        };

        this.init();
    }

    init() {
        this.setupDragDrop();
        this.setupFileInput();
        this.setupURLInput();
        this.setupEditorControls();
        this.setupModalActions();
    }

    setupDragDrop() {
        if (!this.imageDropZone) return;

        this.imageDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.imageDropZone.classList.add('dragover');
        });

        this.imageDropZone.addEventListener('dragleave', () => {
            this.imageDropZone.classList.remove('dragover');
        });

        this.imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.imageDropZone.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            this.handleMultipleFiles(files);
        });

        this.imageDropZone.addEventListener('click', (e) => {
            if (!e.target.closest('.file-browse')) return;
            this.modalImageFile?.click();
        });

        // Paste
        this.imageDropZone.addEventListener('paste', (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) this.handleMultipleFiles([file]);
                    break;
                }
            }
        });
    }

    setupFileInput() {
        if (this.modalImageFile) {
            this.modalImageFile.addEventListener('change', () => {
                const files = Array.from(this.modalImageFile.files);
                this.handleMultipleFiles(files);
            });
        }
    }

    setupURLInput() {
        if (this.btnAddImageUrl) {
            this.btnAddImageUrl.addEventListener('click', () => {
                const url = this.modalImageUrl?.value.trim();
                if (!url) {
                    showToast('Digite uma URL válida', 'error');
                    return;
                }
                if (!this.isValidImageUrl(url)) {
                    showToast('URL inválida. Certifique-se de que é uma imagem (JPG, PNG, WEBP, GIF)', 'error');
                    return;
                }
                this.addPhoto(url, 'url');
                if (this.modalImageUrl) this.modalImageUrl.value = '';
            });
        }
    }

    isValidImageUrl(url) {
        try {
            const urlObj = new URL(url);
            const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
            return validExtensions.some(ext => url.toLowerCase().includes(ext));
        } catch {
            return false;
        }
    }

    handleMultipleFiles(files) {
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            showToast('Nenhuma imagem válida selecionada', 'error');
            return;
        }

        let loadedCount = 0;
        imageFiles.forEach((file, index) => {
            if (file.size > 5 * 1024 * 1024) {
                showToast(`${file.name} excede 5MB e foi ignorado`, 'warning');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.addPhoto(e.target.result, 'file');
                loadedCount++;
                if (loadedCount === imageFiles.length) {
                    showToast(`${loadedCount} imagem(ns) adicionada(s) com sucesso!`, 'success');
                }
            };
            reader.readAsDataURL(file);
        });
    }

    addPhoto(src, type = 'file') {
        const photo = {
            id: Date.now() + Math.random(),
            src,
            type,
            edited: false
        };

        this.photos.push(photo);
        this.selectedPhotoIndex = this.photos.length - 1;
        this.render();
        this.loadPhotoToEditor();
    }

    render() {
        if (!this.imageGallery) return;

        if (this.photos.length === 0) {
            this.imageGallery.innerHTML = `
                <div class="gallery-empty">
                    <i class="bi bi-image"></i>
                    <p>Nenhuma imagem adicionada</p>
                </div>
            `;
        } else {
            this.imageGallery.innerHTML = this.photos.map((photo, index) => `
                <div class="modal-image-item ${index === this.selectedPhotoIndex ? 'active' : ''}" data-index="${index}">
                    <img src="${photo.src}" alt="Preview ${index + 1}">
                    <button type="button" class="btn-remove-img" title="Remover">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            `).join('');

            this.imageGallery.querySelectorAll('.modal-image-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.selectedPhotoIndex = parseInt(item.dataset.index);
                    this.render();
                    this.loadPhotoToEditor();
                });

                const btnRemove = item.querySelector('.btn-remove-img');
                if (btnRemove) {
                    btnRemove.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.removePhoto(parseInt(item.dataset.index));
                    });
                }
            });
        }

        if (this.imageCount) {
            this.imageCount.textContent = this.photos.length;
        }

        this.imageEditorGroup.style.display = this.photos.length > 0 ? 'block' : 'none';
    }

    removePhoto(index) {
        this.photos.splice(index, 1);
        this.selectedPhotoIndex = Math.max(0, Math.min(this.selectedPhotoIndex, this.photos.length - 1));
        this.render();
        if (this.photos.length > 0) {
            this.loadPhotoToEditor();
        }
        showToast('Imagem removida', 'info');
    }

    setupEditorControls() {
        const btnRotateLeft = $('#btnRotateLeft');
        const btnRotateRight = $('#btnRotateRight');
        const btnResetEditor = $('#btnResetEditor');
        const zoomSlider = $('#zoomSlider');
        const brightnessSlider = $('#brightnessSlider');
        const contrastSlider = $('#contrastSlider');

        if (btnRotateLeft) {
            btnRotateLeft.addEventListener('click', () => {
                this.editorState.rotation = (this.editorState.rotation - 90) % 360;
                this.updateEditorCanvas();
            });
        }

        if (btnRotateRight) {
            btnRotateRight.addEventListener('click', () => {
                this.editorState.rotation = (this.editorState.rotation + 90) % 360;
                this.updateEditorCanvas();
            });
        }

        if (zoomSlider) {
            zoomSlider.addEventListener('input', (e) => {
                this.editorState.zoom = parseFloat(e.target.value);
                this.updateEditorCanvas();
            });
        }

        if (brightnessSlider) {
            brightnessSlider.addEventListener('input', (e) => {
                this.editorState.brightness = parseFloat(e.target.value);
                this.updateEditorCanvas();
            });
        }

        if (contrastSlider) {
            contrastSlider.addEventListener('input', (e) => {
                this.editorState.contrast = parseFloat(e.target.value);
                this.updateEditorCanvas();
            });
        }

        if (btnResetEditor) {
            btnResetEditor.addEventListener('click', () => {
                this.editorState = {
                    rotation: 0,
                    zoom: 1,
                    brightness: 1,
                    contrast: 1
                };
                if (zoomSlider) zoomSlider.value = 1;
                if (brightnessSlider) brightnessSlider.value = 1;
                if (contrastSlider) contrastSlider.value = 1;
                this.updateEditorCanvas();
            });
        }
    }

    loadPhotoToEditor() {
        if (this.selectedPhotoIndex === null || !this.photos[this.selectedPhotoIndex]) return;

        const photo = this.photos[this.selectedPhotoIndex];
        const img = new Image();
        img.onload = () => {
            this.currentImage = img;
            this.updateEditorCanvas();
        };
        img.src = photo.src;
    }

    updateEditorCanvas() {
        if (!this.editorCanvas || !this.currentImage) return;

        const ctx = this.editorCanvas.getContext('2d');
        const { rotation, zoom, brightness, contrast } = this.editorState;

        const canvas = this.editorCanvas;
        const size = Math.max(this.currentImage.width, this.currentImage.height) * zoom;
        canvas.width = size;
        canvas.height = size;

        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
        ctx.drawImage(
            this.currentImage,
            -(this.currentImage.width * zoom) / 2,
            -(this.currentImage.height * zoom) / 2,
            this.currentImage.width * zoom,
            this.currentImage.height * zoom
        );
        ctx.restore();

        // Update photo with edited version
        if (this.selectedPhotoIndex !== null) {
            this.photos[this.selectedPhotoIndex].src = canvas.toDataURL('image/jpeg', 0.95);
            this.photos[this.selectedPhotoIndex].edited = true;
        }
    }

    setupModalActions() {
        if (this.btnCancelModal) {
            this.btnCancelModal.addEventListener('click', () => {
                this.reset();
            });
        }
    }

    reset() {
        this.photos = [];
        this.selectedPhotoIndex = null;
        this.editorState = { rotation: 0, zoom: 1, brightness: 1, contrast: 1 };
        this.render();
    }

    getPhotos() {
        return this.photos;
    }

    getEditedPhotosData() {
        return this.photos.map(p => ({
            src: p.src,
            type: p.type,
            edited: p.edited
        }));
    }
}

// Global instance
let photoManager = null;

function initPhotoManager() {
    if (!photoManager) {
        photoManager = new PhotoManager();
    }
    return photoManager;
}
