<ArgonBox py={3}>
    <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
                title="today's money"
                count="$53,000"
                icon={{
                    color: "info",
                    component: <i className="ni ni-money-coins" />,
                }}
                percentage={{
                    color: "success",
                    count: "+55%",
                    text: "since yesterday",
                }}
            />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
                title="today's users"
                count="2,300"
                icon={{
                    color: "error",
                    component: <i className="ni ni-world" />,
                }}
                percentage={{
                    color: "success",
                    count: "+3%",
                    text: "since last week",
                }}
            />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
                title="new clients"
                count="+3,462"
                icon={{
                    color: "success",
                    component: <i className="ni ni-paper-diploma" />,
                }}
                percentage={{
                    color: "error",
                    count: "-2%",
                    text: "since last quarter",
                }}
            />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
                title="sales"
                count="$103,430"
                icon={{
                    color: "warning",
                    component: <i className="ni ni-cart" />,
                }}
                percentage={{
                    color: "success",
                    count: "+5%",
                    text: "than last month",
                }}
            />
        </Grid>
    </Grid>
    <Grid container spacing={3} mb={3}>
        <Grid item xs={12} lg={7}>
            {/* { <GradientLineChart
              title="Sales Overview"
              description={
                <ArgonBox display="flex" alignItems="center">
                  <ArgonBox
                    fontSize={size.lg}
                    color="success"
                    mb={0.3}
                    mr={0.5}
                    lineHeight={0}
                  >
                    <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
                  </ArgonBox>
                  <ArgonTypography
                    variant="button"
                    color="text"
                    fontWeight="medium"
                  >
                    4% more{" "}
                    <ArgonTypography
                      variant="button"
                      color="text"
                      fontWeight="regular"
                    >
                      in 2022
                    </ArgonTypography>
                  </ArgonTypography>
                </ArgonBox>
              }
              
              chart={gradientLineChartData}
            /> } */}
        </Grid>
        <Grid item xs={12} lg={5}>
            <Slider />
        </Grid>
    </Grid>
    <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6} lg={4}>
            <TeamMembers />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <TodoList />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <ProgressTrack />
        </Grid>
    </Grid>
    <Grid container spacing={3} mb={3}>
        <Grid item xs={12} lg={5}>
            <Post />
        </Grid>
        <Grid container item xs={12} lg={7} spacing={3}>
            <Grid item xs={12} height="max-content">
                <ArgonBox
                    sx={{
                        "& .MuiTableContainer-root": {
                            p: 3,
                        },
                        "& .MuiTableRow-root:not(:last-child)": {
                            "& td": {
                                borderBottom: ({
                                    borders: { borderWidth, borderColor },
                                }) => `${borderWidth[1]} solid ${borderColor}`,
                            },
                        },
                    }}
                >
                    <Table
                        columns={projectsTableData.columns}
                        rows={projectsTableData.rows}
                    />
                </ArgonBox>
            </Grid>
            <Grid container item xs={12} spacing={3}>
                <Grid item xs={12} md={6}>
                    <BalanceCard />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CryptoCard />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <SalesTable title="Sales by Country" rows={salesTableData} />
            </Grid>
        </Grid>
    </Grid>
    <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
            <ArgonBox
                sx={{
                    "& .MuiTableRow-root:not(:last-child)": {
                        "& td": {
                            borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                                `${borderWidth[1]} solid ${borderColor}`,
                        },
                    },
                }}
            >
                <Table
                    columns={authorsTableData.columns}
                    rows={authorsTableData.rows}
                />
            </ArgonBox>
        </Grid>
        <Grid item xs={12} md={4}>
            <CategoriesList
                title="categories"
                categories={categoriesListData}
            />
        </Grid>
    </Grid>
</ArgonBox>