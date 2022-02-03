export interface Store {
  address: string;
  city: string;
  country: string;
  id: string;
  image: {
    fields: {
      file: {
        url: string;
      };
      title: string;
    };
  };
  location: { lon: number; lat: number };
  name: string;
  orders: string;
  postalCode: string;
  website: string;
  phoneNumber: string;
  doesDeliver: boolean;
  deliversInRegionOnly: boolean;
}
