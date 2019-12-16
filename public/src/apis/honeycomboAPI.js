async function sendRequest(url, method, data=undefined) {
    return new Promise(function (resolve, reject){
      const xhr = new XMLHttpRequest();
      xhr.open(method, url)

      if (data) {
          data = JSON.stringify(data)
          xhr.setRequestHeader('Content-Type', "application/json")
      } else {
          data = null
      }
      xhr.send(data)

      xhr.addEventListener('load', async function () {
        resolve(JSON.parse(xhr.responseText));
      });
    })
}

async function sendRequestNoResponse(url, method, data=undefined) {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url)

      if (data) {
          data = JSON.stringify(data)
          xhr.setRequestHeader('Content-Type', "application/json")
      } else {
          data = null
      }
      xhr.send(data);
}

const honeycomboAPI = {
    dropoutUser: async (data) => {
        let url = '/auth/dropout/dropUser';
        let method = "POST";
        let result = await sendRequest(url, method, data);
        return result;
    },

    postLogin: async (data) => {
        let url = 'http://localhost:3000/auth/login';
        let method = "POST";
        let result = await sendRequest(url, method, data);
        console.log(result);
        return result;
    },

    getProduct: async (url) => {
        let method = "GET";
        let result = await sendRequest(url, method);
        return result;
    },

    postComment: async (data) => {
        let url = "/recipe/detailRecipe/writeComment"
        let method = "POST"
        let result = await sendRequest(url, method, data);
        return result;
    },

    deleteComment: async (title) => {
        let url = "/recipe/detailRecipe/deleteComment/" + title
        let method = "DELETE"
        let result = await sendRequest(url, method);
        return result;
    },

    putComment: async (title, comment, rate) => {
        let url = "/recipe/detailRecipe/updateComment" + title +"/"+comment+"/"+rate;
        let method = "PUT";
        let result = await sendRequest(url, method);
        return result;
    },

    getRecipeSearch: async (data) => {
        let url = "/recipe/mainRecipe/search"
        let method = "POST"
        let result = await sendRequest(url, method, data);
        return result;
    },

    getTagSearch: async (url) => {
        let method = "GET"
        let result = await sendRequest(url, method);
        return result;
    },

    postUserRecipe: async (data) => {
        let url = "/recipe/writeRecipe/postRecipe"
        let method = "POST"
        await sendRequest(url, method, data);
        window.location.href = '/recipe/detailRecipe/viewDetail/' + data.title + '/';
        // await sendRequestNoResponse(url, method, data);
    }
  };
  export default honeycomboAPI;