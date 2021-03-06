import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import {
  isSearchOnState,
  isReviewingState,
  isBookSelectedState,
} from "../State_Atoms";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, collection, updateDoc, increment } from "firebase/firestore";

function Card({ data }) {
  let { title, imageURL, tags, likes, reviews, description, id } = data;

  let navigate = useNavigate();
  let [Likes, setLikes] = useState(likes);
  const setIsBookSelected = useSetRecoilState(isBookSelectedState);
  const setIsReviewing = useSetRecoilState(isReviewingState);
  let setSearchOn = useSetRecoilState(isSearchOnState);

  let [liking, setLiking] = useState(false);

  const handle = () => {
    setIsBookSelected(true);
    setSearchOn(false);
  };

  const reviewHandle = () => {
    navigate(`/#${title}-${id}`)
    setIsBookSelected(true);
    setIsReviewing(true);
    setSearchOn(false);
  };

  useEffect(() => {
    if (liking) {
      let dbRef = collection(db, "books");
      let bookRef = doc(dbRef, id);

      updateDoc(bookRef, {
        likes: increment(1),
      })
        .then(() => {
          setLikes((curr) => curr + 1);
          setLiking(false);
        })
        .catch((err) => {
          console.error(err);
          setLiking(false);
        });
    }
  }, [id, liking]);

  return (
    <div className="flex justify-start items-start min-w-[300px] max-w-[500px] min-h-48 my-4 mr-10">
      <img
        src={imageURL || `./images/a.jpg`}
        alt={title}
        className="w-32 h-full object-center object-contain mr-4"
      />
      <div className="w-full h-full flex justify-between align-start flex-col">
        <div className="w-full h-full">
          <Link
            to={`#${title}-${id}`}
            className="underline mb-2 block font-medium text-lg capitalize"
            onClick={handle}
          >
            {title}
          </Link>
          <p className="w-full text-xs md:text-sm">{description}</p>
          {tags.length > 0 && (
            <span className="flex justify-start items-center w-full mt-2 flex-wrap">
              {tags.map((tag, index) => {
                return (
                  <Link
                    to="/"
                    className="text-xs bg-green-100 p-1 m-1 rounded-sm whitespacing-nowrap"
                    key={index}
                  >
                    #{tag}
                  </Link>
                );
              })}
            </span>
          )}
        </div>
        <span className="flex justify-between items-center w-full mt-3">
          <button
            className="cursor-pointer text-xs md:text-sm"
            onClick={() => setLiking(true)}
          >
            <span className="inline-flex justify-start items-center mr-1">
              {Likes}
              <FavoriteBorderIcon className="md:ml-1" />
            </span>
            Likes
          </button>
          <button className="cursor-pointer text-xs md:text-sm" onClick={reviewHandle}>
            <span className="inline-flex justify-start items-center mr-1">
              {reviews}
              <RateReviewOutlinedIcon className="md:ml-1" />
            </span>
            Reviews
          </button>
        </span>
      </div>
    </div>
  );
}

export default Card;
