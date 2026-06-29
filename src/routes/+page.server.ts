import type { PageServerLoad } from './$types';
import { getBestShotRating, getCoffeeCount, getShotCount, listRecentShots } from '$lib/server/db';

export const load: PageServerLoad = () => {
  return {
    recentShots: listRecentShots(),
    coffeeCount: getCoffeeCount(),
    shotCount: getShotCount(),
    bestShot: getBestShotRating()
  };
};
