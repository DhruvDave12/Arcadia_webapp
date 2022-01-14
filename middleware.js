const { isValidObjectId } = require("mongoose");
const User = require("./models/user");
const ResetToken = require("./models/resetToken");
const nodemailer = require('nodemailer');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){

        req.session.returnTo = req.originalUrl;
        req.flash('error', "You must be signed in to proceed");
        return res.redirect('/login');
    }
    next();
}

// module.exports.statusChecker = (data, startDate, endDate) => {
//     const currentDate = new Date().toISOString().slice(0,10); // yyyymmdd
//     console.log(currentDate);
//     console.log(startDate);
//     console.log(endDate);
//     const currentYear = parseInt(currentDate.slice(0,4));
//     const yearStart = parseInt(startDate.slice(0,4));
//     const yearEnd = parseInt(endDate.slice(0,4));

//     const monthCurrent = parseInt(currentDate.substring(5,7));
//     const monthStart = parseInt(startDate.substring(5,7));
//     const monthEnd = parseInt(endDate.substring(5,7));

//     const currentDay = parseInt(currentDate.substring(8));
//     const startDay = parseInt(startDate.substring(8));
//     const endDay = parseInt(endDate.substring(8));


//     if(currentYear == yearStart){
//         if(currentYear == yearEnd){
//             if(monthCurrent > monthStart && monthCurrent < monthEnd){
//                 data.eventStatus = "Current";
//             }
//             if(monthCurrent < monthStart){
//                 data.eventStatus = "Future";
//             }
//             if(monthCurrent > monthEnd){
//                 data.eventStatus = "Past";
//             }
//             if(monthCurrent == monthStart && monthCurrent == monthEnd){
//                 if(currentDay >= startDay && currentDay <= endDay){
//                     data.eventStatus = "Current";
//                 }
//                 if(currentDay < startDay){
//                     data.eventStatus = "Future";
//                 }
//                 if(currentDay > endDay){
//                     data.eventStatus = "Past";
//                 }
//             }
//             else if(monthCurrent == monthEnd){
//                 if(currentDay <= endDay){
//                     data.eventStatus = "Current";
//                 }
//                 if(currentDay > endDay){
//                     data.eventStatus = "Past";
//                 }
//             } else if(monthCurrent == monthStart){
//                 if(currentDay < startDay){
//                     data.eventStatus = "Future";
//                 }
//                 if(currentDay >= startDay){
//                     data.eventStatus = "Current";
//                 }
//             }
//         }
//         else if(currentYear < yearEnd){
//             data.eventStatus = "Current";
//         }
//     } else if(currentYear < yearStart){
//         data.eventStatus = "Future";
//     } else{
//         data.eventStatus = "Past";
//     }
//     return data;
// }

module.exports.statusChecker = (data) => {
    
    const currentDate = new Date().toISOString().slice(0,10); // yyyymmdd
    const currentYear = parseInt(currentDate.slice(0,4));
    const yearStart = parseInt(data.startDate.slice(0,4));
    const yearEnd = parseInt(data.endDate.slice(0,4));

    const monthCurrent = parseInt(currentDate.substring(5,7));
    const monthStart = parseInt(data.startDate.substring(5,7));
    const monthEnd = parseInt(data.endDate.substring(5,7));

    const currentDay = parseInt(currentDate.substring(8));
    const startDay = parseInt(data.startDate.substring(8));
    const endDay = parseInt(data.endDate.substring(8));


    if(currentYear == yearStart){
        if(currentYear == yearEnd){
            if(monthCurrent > monthStart && monthCurrent < monthEnd){
                data.eventStatus = "Current";
            }
            if(monthCurrent < monthStart){
                data.eventStatus = "Future";
            }
            if(monthCurrent > monthEnd){
                data.eventStatus = "Past";
            }
            if(monthCurrent == monthStart && monthCurrent == monthEnd){
                if(currentDay >= startDay && currentDay <= endDay){
                    data.eventStatus = "Current";
                }
                if(currentDay < startDay){
                    data.eventStatus = "Future";
                }
                if(currentDay > endDay){
                    data.eventStatus = "Past";
                }
            }
            else if(monthCurrent == monthEnd){
                if(currentDay <= endDay){
                    data.eventStatus = "Current";
                }
                if(currentDay > endDay){
                    data.eventStatus = "Past";
                }
            } else if(monthCurrent == monthStart){
                if(currentDay < startDay){
                    data.eventStatus = "Future";
                }
                if(currentDay >= startDay){
                    data.eventStatus = "Current";
                }
            }
        }
        else if(currentYear < yearEnd){
            data.eventStatus = "Current";
        }
    } else if(currentYear < yearStart){
        data.eventStatus = "Future";
    } else{
        // here current year is greate than startYear means current or past depending on month and day
        if(monthCurrent < monthEnd){
            data.eventStatus = "Current";
        } else if (monthCurrent == monthEnd) {
            if(currentDay <= endDay){
                data.eventStatus = "Current";
            } else {
                data.eventStatus = "Past";
            }
        }else{
            data.eventStatus = "Past";
        }
    }
    return data;
}

exports.isResetTokenValid = async(req,res,next) => {
    const {token, id} = req.query;

    if(!token || !id) return req.flash("failure", "Invalid Request");

    if(!isValidObjectId(id)){
        return res.send("Invalid user!");
    }

    const user = await User.findById(id);
    if(!user) return res.send("User not found");

    const resetToken = await ResetToken.findOne({ownder: user._id});
    if(!resetToken){
        return res.send("Resent token not found");
    }

    const isValid = await resetToken.compareToken(token);
    if(!isValid){
        return res.send("Reset token not valid");
    }

    req.user = user;
    next();
}
