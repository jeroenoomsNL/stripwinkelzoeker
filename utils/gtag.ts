export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackOutboundLink = function (url: string) {
  gtag("event", "klik", {
    event_category: "uitgaand",
    event_label: url,
    transport_type: "beacon",
  });
};

export const trackFilter = function (filter: string) {
  gtag("event", "klik", {
    event_category: "filters",
    event_label: filter,
    transport_type: "beacon",
  });
};
