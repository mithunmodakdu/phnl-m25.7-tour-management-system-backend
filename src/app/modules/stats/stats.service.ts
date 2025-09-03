/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model";
import { Tour } from "../tour/tour.model";
import { EIsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);   //output in milliseconds
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30); //output in milliseconds


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
    },

    //stage-2: unwind array to object
    {
        $unwind: "$type"
    },

    //stage-3: grouping by type name
    {
        $group: {
            _id: "$type.name",
            count: { $sum: 1 }
        }
    }

  ]);

  const avgTourCostPromise = Tour.aggregate([
    //stage-1: grouping all tours in a group, average the cost
    {
        $group: {
            _id: null,
            avgCostFrom: {$avg: "$costFrom"}
        }
    }  
  ]);

  const totalToursByDivisionPromise = Tour.aggregate([
    //stage-1: connect tourType model using lookup
    {
        $lookup: {
            from: "divisions",
            localField: "division",
            foreignField: "_id",
            as: "division"
        }
    },

    //stage-2: unwind array to object
    {
        $unwind: "$division"
    },

    //stage-3: grouping by type name
    {
        $group: {
            _id: "$division.name",
            count: { $sum: 1 }
        }
    }

  ]);

  const totalOfHighestBookedTourPromise = Booking.aggregate([
    //stage-1: group by tour
    {
        $group : {
            _id: "$tour",
            bookingCount: { $sum: 1 }
        }
    },

    //stage-2: sort the tours descending
    {
        $sort: {bookingCount: -1}
    },

    //stage-3: limit the tours by 5
    {
        $limit: 5
    },

    //stage-4: lookup with pipeline, let
    {
        $lookup: {
            from: "tours",
            let: {tourId: "$_id"},
            pipeline: [
                {
                    $match: {
                        $expr: { $eq: ["$_id", "$$tourId"]}
                        //for local field $$
                        //for foreign field $
                    }
                }
            ],
            as: "tour"
        }
    },

    //stage-5: unwind
    {
        $unwind: "$tour"
    },

    //stage-6: project
    {
        $project: {
            bookingCount: 1,
            "tour.title": 1,
            "tour.slug": 1
        }
    }

  ]);

  const [
    totalTours,
    totalToursByTourType,
    avgTourCost,
    totalToursByDivision,
    totalOfHighestBookedTour

  ] = await Promise.all([
    totalToursPromise,
    totalToursByTourTypePromise,
    avgTourCostPromise,
    totalToursByDivisionPromise,
    totalOfHighestBookedTourPromise
  ]);


  return {
    totalTours,
    totalToursByTourType,
    avgTourCost,
    totalToursByDivision,
    totalOfHighestBookedTour
  };
};

const getBookingStats = async () => {
  const totalBookingsPromise = Booking.countDocuments();

  const totalBookingsByStatusPromise = Booking.aggregate([

    //stage-1: group by status
    {
        $group: {
            _id: "$status",
            count: {$sum: 1}
        }
    }
  ]);

  const bookingPerTourPromise = Booking.aggregate([
    //stage-1: group stage
    {
        $group: {
            _id: "$tour",
            bookingCount: { $sum: 1}
        }
    },

    //stage-2: sort stage
    {
        $sort: {bookingCount: -1}
    },

    //stage-3: limit stage
    {
        $limit: 10
    },

    //stage-4: lookup stage
    {
        $lookup: {
            from: "tours",
            localField: "_id",
            foreignField: "_id",
            as: "tour"
        }
    },

    //stage-5: unwind stage
    {
        $unwind: "$tour"
    },

    //stage-6: project stage
    {
        $project: {
            _id: 1,
            bookingCount: 1,
            "tour.title": 1,
            "tour.slug": 1
        }
    }


  ]);

  const avgGuestCountPerBookingPromise = Booking.aggregate([
    {
      $group: {
        _id: null,
        avgGuestCount: {$avg: "$guestCount"}
      }
    }
  ]);

  const bookingsInLastSevenDaysPromise = Booking.countDocuments(
    {
      createdAt: {$gte: sevenDaysAgo}
    }
  );

  const bookingsInLastThirtyDaysPromise = Booking.countDocuments(
    {
      createdAt: {$gte: thirtyDaysAgo}
    }
  );

  const totalBookingsByUniqueUserPromise = Booking.distinct("user").then((user: any) => user.length);

  const [
    totalBookings,
    totalBookingsByStatus,
    bookingPerTour,
    avgGuestCountPerBooking,
    bookingsInLastSevenDays,
    bookingsInLastThirtyDays,
    totalBookingsByUniqueUser
    

  ] = await Promise.all([
    totalBookingsPromise,
    totalBookingsByStatusPromise,
    bookingPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingsInLastSevenDaysPromise,
    bookingsInLastThirtyDaysPromise,
    totalBookingsByUniqueUserPromise
  ]);

  return {
    totalBookings,
    totalBookingsByStatus,
    bookingPerTour,
    avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
    bookingsInLastSevenDays,
    bookingsInLastThirtyDays,
    totalBookingsByUniqueUser
  };
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
