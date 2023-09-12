const config = {
  port: 5000,
  CORS: {
    origin: [
      'http://localhost:8080',
      'http://localhost:5500',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://192.168.1.78:3000',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  },
};

export default config;
