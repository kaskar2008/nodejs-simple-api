class UserController {
  /**
   * Handles GET request
   */
  index() {
    return {
      ok: true,
      message: 'flawless'
    };
  }

  /**
   * Handles a POST request
   * @param {RouteData} data Route data
   */
  handlePost(data) {
    return data.body;
  }

  /**
   * Handles GET request
   * Custom response test
   */
  myHandler() {
    return (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('this is mine!');
    }
  }
}

module.exports = new UserController();
