import { Tour } from "../tour/tour.model";
import { EIsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
console.log(new Date(sevenDaysAgo));
console.log(new Date(thirtyDaysAgo));

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: EIsActive.ACTIVE,
  });
  const totalInActiveUsersPromise = User.countDocuments({
    isActive: EIsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: EIsActive.BLOCKED,
  });

  const newUsersInLastSevenDaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const newUsersInLastThirtyDaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = User.aggregate([
    //stage-1: group users by role & count total users in each group
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLastSevenDays,
    newUsersInLastThirtyDays,
    usersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInActiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLastSevenDaysPromise,
    newUsersInLastThirtyDaysPromise,
    usersByRolePromise,
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLastSevenDays,
    newUsersInLastThirtyDays,
    usersByRole,
  };
};

const getTourStats = async () => {
  const totalToursPromise = Tour.countDocuments();

  const totalToursByTourTypePromise = Tour.aggregate([
    //stage-1: connect tourType model using lookup
    {
        $lookup: {
            from: "tourtypes",
            localField: "tourType",
            foreignField: "_id",
            as: "type"
        }
    }
  ]);

  const [
    totalTours,
    totalToursByTourType

  ] = await Promise.all([
    totalToursPromise,
    totalToursByTourTypePromise

  ]);


  return {
    totalTours,
    totalToursByTourType
  };
};

const getBookingStats = async () => {
  return {};
};

const getPaymentStats = async () => {
  return {};
};

export const StatsService = {
  getBookingStats,
  getPaymentStats,
  getTourStats,
  getUserStats,
};
