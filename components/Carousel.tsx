import Image from "next/image";
import { useRouter } from "next/router";
import useKeypress from "react-use-keypress";
import { useState } from "react";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import SharedModal from "./SharedModal";

// Generic blur data URL (light gray color)
const genericBlurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII=";

export default function Carousel({
  index,
  currentPhoto,
}: {
  index: number;
  currentPhoto: ImageProps;
}) {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();
  const [isLoading, setIsLoading] = useState(true);

  function closeModal() {
    setLastViewedPhoto(currentPhoto.id);
    router.push("/", undefined, { shallow: true });
  }

  function changePhotoId(newVal: number) {
    return newVal;
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
      >
        <Image
          src={`http://localhost:8080/api/show?uuid=${currentPhoto.uuid}`}
          className="pointer-events-none h-full w-full opacity-50"
          alt="blurred background"
          fill
          priority={true}
          placeholder="blur"
          blurDataURL={genericBlurDataURL}
        />
      </button>
      <div className="z-50 w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative aspect-[3/2]">
          <Image
            src={`http://localhost:8080/api/show?uuid=${currentPhoto.uuid}`}
            alt="Carousel image"
            className={`duration-700 ease-in-out ${
              isLoading
                ? "scale-110 blur-2xl grayscale"
                : "scale-100 blur-0 grayscale-0"
            }`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
            placeholder="blur"
            blurDataURL={genericBlurDataURL}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
      </div>
      <SharedModal
        index={index}
        changePhotoId={changePhotoId}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
        navigation={false}
      />
    </div>
  );
}