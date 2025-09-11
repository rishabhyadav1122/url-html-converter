import { urlToHtml } from "./index.js";

try {
  const html = await urlToHtml("https://www.savaari.com/select_cars?from_city_name=Bangalore,%20Karnataka&from_city_id=377&trip_sub_type=oneWay&trip_type=outstation&pickup_date=09-09-2025&pickup_time=07:00&drop_date=&destCityId=1222&destCityName=Mysore&from_city_cords=&to_city_cords=", "dynamic");
  console.log(html.length);
} catch (err) {
  console.error("Test failed:", err.message);
}
