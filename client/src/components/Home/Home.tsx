import React, { useEffect, useState, Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

import { BASE_URL } from "../../base/baseURL";
import Gap from "../Gap/Gap";
import Metered from "../Metered/Metered";
import SubTitle from "../SubTitle/SubTitle";
import Loading from "../Loading/Loading";
import Wrapper from "../Wrapper/Wrapper";
import SvgUndrawDevFocus from "../../icons/SvgUndrawDevFocus";
import FixedAddLink from "../FixedAddLink/FixedAddLink";

interface Props {}

interface IChallenge {
  challenge_id: string;
  title: string;
  hash_tag: string;
  goal: string;
  date_created: number;
}

const Home = (props: Props) => {
  const responseType = ["loading", "empty", "success", "error"];
  const [challengeList, setChallengeList] = useState<Array<IChallenge>>([]);
  const [serverResponse, setServerResponse] = useState(responseType[0]);

  let progress: any = useRef([]);
  const dateOptions = {
    day: "numeric",
    month: "short",
    year: "numeric"
  };

  useEffect(() => {
    async function getAllChallenges(url: string) {
      const response: any = await fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.length === 0) {
            setServerResponse(responseType[1]);
          } else {
            setServerResponse(responseType[2]);
            setChallengeList(data);
          }
          return data;
        })
        .catch(err => {
          if (err) {
            setServerResponse(responseType[3]);
            throw new Error(err.message);
          }
        });

      if (response.length > 0) {
        progress.current = await Promise.all(
          response.map((r: any) =>
            getChallengeDetail(BASE_URL!, r.challenge_id)
          )
        ).catch(err => {
          if (err) {
            throw new Error(err.message);
          }
        });
      }
    }

    getAllChallenges(BASE_URL!);
  }, []);

  // GSAP ANIMATION
  let cardElement: any = useRef([]);

  useEffect(() => {
    if (serverResponse === responseType[2]) {
      gsap.from(cardElement.current, {
        opacity: 0,
        autoAlpha: 0,
        delay: 0.2,
        duration: 1.5,
        yPercent: 67,
        stagger: 0.2,
        ease: "back"
      });
    }
  });

  async function getChallengeDetail(url: string, id: string) {
    try {
      const response = await fetch(`${url}/detail/${id}`).then(res =>
        res.json()
      );
      if (response[0] === null) {
        response.shift();
      }
      return response.length;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  if (serverResponse === responseType[3]) {
    return <div>ERROR</div>;
  } else if (serverResponse === responseType[0]) {
    return (
      <Wrapper customClass="container mx-auto">
        <Gap className="h-16" />
        <Loading />
        <Gap className="h-4" />
      </Wrapper>
    );
  } else if (serverResponse === responseType[1]) {
    return (
      <Fragment>
        <Gap className="h-5" />
        <SubTitle subtitle="My Journey to Awesomeness!" emoji="⭐️" />
        <Link to="/add">
          <h2 className="text-center pt-12 underline">
            Add your first challenge!
          </h2>
        </Link>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <Gap className="h-5" />
        <SubTitle subtitle="My Journey to Awesomeness!" emoji="⭐️" />
        <Wrapper customClass="flex justify-around items-center md:pt-8">
          <Wrapper customClass="w-1/2">
            <SvgUndrawDevFocus className="w-3/4 h-48 mx-auto md:hidden" />
            <Gap className="h-2" />
            <ul className="px-2 max-w-md mx-auto sm:px-6">
              {challengeList.map((challenge, idx) => {
                return (
                  <li
                    ref={el => cardElement.current.push(el)}
                    key={challenge.challenge_id}
                    className="rounded-lg bg-purple-100 border border-purple-400 mb-4 overflow-hidden card"
                  >
                    <Link
                      className="block"
                      to={{
                        pathname: `detail/${challenge.challenge_id}`,
                        state: {
                          hashtag: challenge.hash_tag
                        }
                      }}
                    >
                      <Wrapper customClass="flex flex-wrap justify-between capitalize  bg-purple-400 p-2 items-center">
                        <h3 className="sm:text-lg">{challenge.title}</h3>
                        <p className="text-gray-900 opacity-75 text-sm">
                          {new Intl.DateTimeFormat(
                            "default",
                            dateOptions
                          ).format(challenge.date_created)}
                        </p>
                      </Wrapper>
                      <p className="capitalize text-gray-900 opacity-75 px-4 pt-2">
                        {challenge.goal}
                      </p>
                      <p className="text-gray-600 opacity-75 text-sm px-4 pb-2">
                        {challenge.hash_tag}
                      </p>
                      <Metered progress={progress.current[idx]} />
                    </Link>
                    <Gap className="h-4" />
                  </li>
                );
              })}
            </ul>
          </Wrapper>
          <Wrapper customClass="hidden md:block relative w-1/2 top-0 right-0 h-screen self-start">
            <SvgUndrawDevFocus className="hidden w-3/4 absolute top-0 md:block" />
          </Wrapper>
        </Wrapper>
        <FixedAddLink />
      </Fragment>
    );
  }
};

export default Home;
