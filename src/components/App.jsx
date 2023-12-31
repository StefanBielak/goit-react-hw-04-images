import React, { useState, useEffect } from "react";
import Searchbar from "#components/Searchbar/Searchbar";
import ImageGallery from "#components/ImageGallery/ImageGallery";
import Button from "#components/Button/Button";
import Loader from "#components/Loader";
import Modal from "#components/Modal/Modal";
import { getLinkByPageAndQuery } from "#consts/pixabay";
import styles from "./App.module.css";


export const App = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (query === "") {
      return;
    }

    setIsLoading(true);
    fetchImages(query, 1);
  }, [query]);

  const fetchImages = (searchQuery, pageNumber) => {
    const link = getLinkByPageAndQuery(searchQuery, pageNumber);
    console.log("Request URL:", link);
  
    fetch(link)
      .then((response) => {
        console.log("Response:", response);
        return response.json();
      })
      .then((data) => {
        setImages((prevImages) => [...prevImages, ...data.hits]);
        setPage(pageNumber + 1);
      })
      .catch((error) => console.error("Error fetching data: ", error))
      .finally(() => setIsLoading(false));
  };
  const handleSearchSubmit = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    setImages([]);
  };

  const loadMoreImages = () => {
    fetchImages(query, page);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image.largeImageURL);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.app}>
      <Searchbar onSubmit={handleSearchSubmit} />
      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={handleImageClick} />
      )}
      {isLoading && <Loader />}
      {images.length > 0 && !isLoading && (
        <Button onClick={loadMoreImages} isVisible={true} />
      )}
      {selectedImage && <Modal onClose={closeModal} largeImageURL={selectedImage} />}
    </div>
  );
};