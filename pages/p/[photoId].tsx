import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
// import cloudinary from "../../utils/cloudinary";
// import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  // console.log("🚀 ~ currentPhoto:", currentPhoto);
  const router = useRouter();
  const { photoId } = router.query;
  // console.log("🚀 ~ photoId:", photoId)
  let index = Number(photoId);

  const currentPhotoUrl = `http://localhost:8080/api/show?uuid=${photoId}`;

  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const response = await fetch("http://localhost:8080/api/images");
    if (!response.ok) {
      throw new Error("Failed to fetch images");
    }
    const images: ImageProps[] = await response.json();

    const reducedResults: ImageProps[] = images.map((image, index) => ({
      id: index,
      height: "auto",
      width: "auto",
      uuid: image.uuid,
      format: image.fileType.split("/")[1], // Assuming fileType is like "image/jpeg"
      fileName: image.fileName,
      size: image.size,
      fileType: image.fileType,
    }));

    const currentPhoto = reducedResults.find(
      (img) => img.id === Number(context.params.photoId)
    );

    return {
      props: {
        currentPhoto: currentPhoto,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        currentPhoto: null,
      },
    };
  }
};

export async function getStaticPaths() {

  return {
    paths: [],
    fallback: false,
  };
}
