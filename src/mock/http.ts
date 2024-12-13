//模拟的请求数据
export default {
  getData: () => {
    return {
      code: 200,
      tableData: [
        {
          id: "01",
          name: "get测试001",
        },
        {
          id: "02",
          name: "get测试002",
        },
        {
          id: "03",
          name: "get测试003",
        },
        {
          id: "04",
          name: "get测试004",
        },
      ],
    };
  },
  postData: () => {
    return {
      code: 200,
      tableData2: [
        {
          id: "01",
          name: "post测试001",
        },
        {
          id: "02",
          name: "post测试002",
        },
        {
          id: "03",
          name: "post测试003",
        },
        {
          id: "04",
          name: "post测试004",
        },
      ],
    };
  },
};

