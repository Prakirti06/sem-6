const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/roles", require("./routes/roleRoutes"));
app.use("/tickets", require("./routes/ticketRoutes"));
app.use("/tickets", require("./routes/commentRoutes"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});