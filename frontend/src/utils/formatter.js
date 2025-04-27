import moment from 'moment';

export const formatCurrency = (amount) => {
if (amount === undefined || amount === null) return '$0.00';
return $${parseFloat(amount).toFixed(2)};
};

export const formatDate = (date) => {
if (!date) return '';
return moment(date).format('MMM D, YYYY h:mm A');
};

export const formatTimeLeft = (endTime) => {
if (!endTime) return 'End time not specified';

const end = moment(endTime);
const now = moment();

if (now.isAfter(end)) {
return 'Auction has ended';
}

const duration = moment.duration(end.diff(now));
const days = Math.floor(duration.asDays());
const hours = duration.hours();
const minutes = duration.minutes();
const seconds = duration.seconds();

let timeString = '';
if (days > 0) timeString += ${days}d ;
if (hours > 0) timeString += ${hours}h ;
if (minutes > 0) timeString += ${minutes}m ;
timeString += ${seconds}s;

return timeString;
};