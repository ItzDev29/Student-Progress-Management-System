const axios = require("axios");

exports.fetchCodeforcesData = async (handle) => {
  const profile = {};
  
  // 1. Basic info
  const infoRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
  const user = infoRes.data.result[0];
  profile.currentRating = user.rating;
  profile.maxRating = user.maxRating;

  // 2. Contest History
  const contestRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
  profile.contests = contestRes.data.result.map(c => ({
    name: c.contestName,
    ratingChange: c.newRating - c.oldRating,
    rank: c.rank,
    newRating: c.newRating,
    date: new Date(c.ratingUpdateTimeSeconds * 1000),
    unsolvedCount: Math.floor(Math.random() * 5) // fake for now
  }));

  // 3. Submission Stats
  const subRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`);
  const submissions = subRes.data.result;

  const solvedSet = new Set();
  const heatmap = {};
  const ratingBuckets = {};

  for (const sub of submissions) {
    const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
    heatmap[date] = (heatmap[date] || 0) + 1;

    if (sub.verdict === 'OK') {
      const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
      solvedSet.add(problemId);

      const rating = sub.problem.rating || 0;
      const bucket = `${Math.floor(rating / 100) * 100}-${Math.floor(rating / 100) * 100 + 99}`;
      ratingBuckets[bucket] = (ratingBuckets[bucket] || 0) + 1;
    }
  }

  const submissionHeatmap = Object.entries(heatmap).map(([date, count]) => ({ date, count }));

  const bucketsArray = Object.entries(ratingBuckets).map(([range, count]) => ({
    range,
    count
  }));

  profile.stats = {
    totalSolved: solvedSet.size,
    avgDaily: (solvedSet.size / 365).toFixed(2),
    avgRating: (Object.keys(ratingBuckets).length ? Object.entries(ratingBuckets).reduce((sum, [range, count]) => {
      const mid = parseInt(range.split('-')[0]) + 50;
      return sum + mid * count;
    }, 0) / Object.values(ratingBuckets).reduce((a, b) => a + b, 0) : 0).toFixed(0),
    toughest: [...solvedSet][Math.floor(Math.random() * solvedSet.size)] || 'N/A',
    ratingBuckets: bucketsArray
  };

  profile.submissionHeatmap = submissionHeatmap;

  return profile;
};
