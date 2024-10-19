import React from 'react';
import Modal from 'react-modal';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

Modal.setAppElement('#root');

const ImageZoomModal = ({ isOpen, onRequestClose, imageSrc }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Zoomed Image"
      className="flex justify-center items-center outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
    >
      <Zoom>
        <img src={imageSrc} alt="Product" className="w-full h-auto max-w-lg rounded-md" />
      </Zoom>
    </Modal>
  );
};

import PropTypes from "prop-types";

ImageZoomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Modal visibility state
  onRequestClose: PropTypes.func.isRequired, // Function to close the modal
  imageSrc: PropTypes.string.isRequired, // Source URL of the image to display
};

export default ImageZoomModal;
