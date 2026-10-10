import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { galleryImages } from '../data/gallery'

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const openModal = (index) => {
    setSelectedIndex(index)
    setSelectedImage(galleryImages[index])
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const nextIndex = (selectedIndex + 1) % galleryImages.length
    setSelectedIndex(nextIndex)
    setSelectedImage(galleryImages[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = (selectedIndex - 1 + galleryImages.length) % galleryImages.length
    setSelectedIndex(prevIndex)
    setSelectedImage(galleryImages[prevIndex])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') closeModal()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1>Cafe Gallery</h1>
        <p>Behind the scenes • Our craft • The atmosphere</p>
      </div>
      
      <div className="gallery-grid">
        {galleryImages.map((image, index) => (
          <div 
            key={image.id} 
            className="gallery-item"
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            onClick={() => openModal(index)}
          >
            <img src={image.src} alt={image.alt} className="gallery-image" />
            <div className="gallery-overlay">
              <Camera size={24} />
              <span>View</span>
            </div>
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal} onKeyDown={handleKeyPress} tabIndex={0}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            <button className="modal-nav modal-nav-left" onClick={prevImage}>
              <ChevronLeft size={32} />
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} className="modal-image" />
            <button className="modal-nav modal-nav-right" onClick={nextImage}>
              <ChevronRight size={32} />
            </button>
            <div className="modal-caption">
              <p>{selectedImage.alt}</p>
              <span>{selectedIndex + 1} / {galleryImages.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
