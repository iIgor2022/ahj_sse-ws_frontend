export default class Chat {
  constructor(container) {
    this.ws = new WebSocket("ws://localhost:7070");
    this.container = container;
  }

  addSocketEvents() {
    this.ws.addEventListener("error", (event) => console.log(`ws error: ${event}`));

    this.ws.addEventListener("open", (event) => console.log(`ws open: ${event}`));

    this.ws.addEventListener("message", (event) => {
      let data = null;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.log(`json parse error: ${error}`);
      }

      if (data) {
        switch (data.flag) {
          case "IdUser":
            localStorage.setItem("IdUser", data.IdUser);
            break;
          case "members":
            this.renderListMembers(data.body);
            break;
          case "error":
            divError.textContent = data.body;
            formLogin.classList.remove("hidden");
            break;
          case "message":
            this.renderMessage(data.body);
            break;
          default:
            break;
        }
      }
    });
  }

  init() {
    this.addSocketEvents();
    this.container.querySelector(".btn-login").addEventListener("click", (ev) => {
      ev.preventDefault();

      const nick = inputLogin.value;
      this.ws.send(JSON.stringify({ flag: "user", nick }));
      formLogin.classList.add("hidden");
    });
    this.container.querySelector("#input-message").addEventListener("keydown", (ev) => {
      if (ev.keyCode === 13) {
        const text = inputMessage.value;

        if (!text) return;

        const objMessage = {
          id: localStorage.getItem("IdUser"),
          text,
          date: Date.now(),
        };
        this.ws.send(JSON.stringify({ flag: "message", objMessage }));
      }
    })
  }

  renderMessage({ id, nick, text, date }) {
    //
  }

  renderListMembers(memberList) {
    //
  }
}
