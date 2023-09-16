// import Server from "../index";
// import cors from "cors";

// const app = Server();
// const router = app.router();

// // var whitelist = ["localhost:3000"];
// // var corsOptions = {
// //   origin: function (origin, callback) {
// //     if (whitelist.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// // };

// //app.use(cors(corsOptions));

// app.get("/user", (req, res) => {
//   res.status(200).json(req.body);
// });

// app.post('/', (req, res) => {
//   res.status(200).send("app post")
// })

// app.use((req,res, next) => {
//   console.log('middle ware');
//   next();
// })

// // app.get('/', (req, res) => {
// //   console.log('not handle')
// //   // res.status(200).send("app get")
// // })
// router.use((req, res, next) => {
//   console.log('router middleware');
// })

// router.get('/', (req, res) => {
//   res.status(200).send("route get")
// })

// router.post('/', (req, res) => {
//   res.status(200).send("router post")
// })
// // app.use((req, res, next) => {
// //   res.status(400).send('Yoy')
// // })

// // app.use((req, res, next) => {
// //   res.status(400).send('Not found')
// // })

// app.use('/', router);

// // app.use((req, res, next, err) => {
// //     res.status(500).send('Error happened');
// //  });

// app.listen(3000, () => {
//   console.log("Running on port 3000");
// });
import server from "../index";

const app = server()
const router = app.router()

app.get("/user", (req, res) => {
  res.status(200).json(req.body);
});

router.get('/', async (req, res) => {
  //const data = await (await fetch('https://www.fishwatch.gov/api/species')).json()
  res.status(200).json({ message: 'sdsdsd'})
})

app.use('/', router);

app.listen(3000, () => {
  console.log('App is listening on port 3000')
})