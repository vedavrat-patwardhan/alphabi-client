import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import type { BaseSyntheticEvent } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import SkeletonLoader from '@/components/SkeletonLoader';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

interface GifyModel {
  id: string;
  images: {
    original: {
      url: string;
    };
  };
  title: string;
  user: {
    description: string;
  };
}

const Dashboard = () => {
  const { push } = useRouter();
  const notify = () => toast('Logged out Successfully!');
  const updateNotify = () => toast('Favorite updated');
  const [gifs, setGifs] = useState<GifyModel[]>([]);
  const [user, setUser] = useState<{ email: string; favorites: string[] }>({
    email: '',
    favorites: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState('');
  const gifCount = 6;
  const handleChange = (e: BaseSyntheticEvent) => {
    setQuery(e.target.value);
    setIsLoading(true);
  };
  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    notify();
    push('/');
  };
  const updateFavorite = (id: string, isFavorite: boolean) => {
    let updatedFavorites: string[] = [];
    if (isFavorite) {
      updatedFavorites = user.favorites.filter(
        (favoriteId) => favoriteId !== id
      );
    } else {
      updatedFavorites = [...user.favorites, id];
    }
    axios
      .patch(
        `${process.env.BASE_URL}/v1/auth/update-favorite`,
        {
          favorites: updatedFavorites,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setUser((prevVal) => ({ ...prevVal, favorites: updatedFavorites }));
        sessionStorage.setItem(
          'user',
          JSON.stringify({ ...user, favorites: updatedFavorites })
        );
        updateNotify();
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!sessionStorage.getItem('token')) {
        push('/');
      } else if (sessionStorage.getItem('user')) {
        // @ts-ignore
        setUser(JSON.parse(sessionStorage.getItem('user')));
        setToken(sessionStorage.getItem('token')!);
      }
    }
    return () => {
      debouncedResults.cancel();
    };
  }, []);
  useEffect(() => {
    axios
      .get(
        `https://api.giphy.com/v1/gifs/search?api_key=${
          process.env.GIFY_API_KEY
        }&q=${query}&limit=${gifCount}&offset=${(currentPage - 1) * gifCount}`
      )
      .then((res) => {
        setLastPage(Math.floor(res.data.pagination.total_count / gifCount));
        setTotalCount(res.data.pagination.total_count);
        setGifs(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [query, currentPage]);

  return (
    <Main meta={<Meta title="Dashboard" description="AlphaBi task" />}>
      <div className="mx-auto min-h-screen w-4/5 pt-8">
        <div className="mb-8 flex">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search Gif"
              name="query"
              onChange={debouncedResults}
              className="input-bordered input w-full"
            />
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <button className="btn btn-secondary ml-8" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {gifs.length === 0 && (
          <div className="flex items-center justify-center">
            {isLoading ? (
              <div className="mb-8 flex flex-wrap justify-between gap-2">
                {Array(6)
                  .fill('loader')
                  .map((_item, i) => (
                    <SkeletonLoader key={i} />
                  ))}
              </div>
            ) : (
              <h1 className="text-4xl">Type in search bar to find gifs</h1>
            )}
          </div>
        )}
        <div className="mb-8 flex flex-wrap justify-between gap-2">
          {gifs.map((gif) => (
            <div
              className="card card-compact bg-base-100 shadow-xl sm:w-full md:w-5/12 lg:w-72 xl:w-80 2xl:w-96"
              key={gif.id}
            >
              <figure>
                <img
                  src={gif.images.original.url}
                  alt={gif.title}
                  className="h-64 rounded-lg object-cover shadow-lg hover:shadow-xl"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{gif.title}</h2>
                <p>{gif.user.description}</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      updateFavorite(gif.id, user.favorites.includes(gif.id))
                    }
                  >
                    {user.favorites.includes(gif.id)
                      ? 'Remove from favorites'
                      : 'Add to favorite'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalCount > 9 && (
          <div className="btn-group mb-8 w-full place-content-center">
            {currentPage > 1 && (
              <button
                className="btn"
                onClick={() => setCurrentPage((prevVal: number) => prevVal - 1)}
              >
                {currentPage - 1}
              </button>
            )}
            <button className="btn btn-active">{currentPage}</button>
            {lastPage > currentPage + 2 && (
              <button
                className="btn"
                onClick={() => setCurrentPage((prevVal: number) => prevVal + 1)}
              >
                {currentPage + 1}
              </button>
            )}
            <button className="btn-disabled btn">...</button>
            {lastPage - 1 > currentPage && (
              <button
                className="btn"
                onClick={() => setCurrentPage(lastPage - 1)}
              >
                {lastPage - 1}
              </button>
            )}
            {lastPage > currentPage && (
              <button className="btn" onClick={() => setCurrentPage(lastPage)}>
                {lastPage}
              </button>
            )}
          </div>
        )}
      </div>
      <ToastContainer position="bottom-center" />
    </Main>
  );
};

export default Dashboard;
