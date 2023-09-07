import formatDate from "./formatDate";

export default class Chat {
  constructor(container) {
    this.ws = new WebSocket("ws://3.75.158.163:7070/ws");
    this.container = container;
    this.formLogin = container.querySelector(".login");
  }

  addSocketEvents() {
    this.ws.addEventListener("error", (event) =>
      console.log(`ws error: ${event}`),
    );

    this.ws.addEventListener("open", (event) =>
      console.log(`ws open: ${event}`),
    );

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
            this.container.querySelector(".error").textContent = data.body;
            this.formLogin.classList.remove("hidden");
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
    this.container
      .querySelector(".btn-login")
      .addEventListener("click", (ev) => {
        ev.preventDefault();

        const nick = this.container.querySelector("#nick").value;
        if (nick) {
          this.ws.send(JSON.stringify({ flag: "user", nick }));
          this.formLogin.classList.add("hidden");
        }
      });
    this.container
      .querySelector("#input-message")
      .addEventListener("keydown", (ev) => {
        if (ev.keyCode === 13) {
          const inputMessage = this.container.querySelector("#input-message");
          const text = inputMessage.value;

          if (!text) return;

          const objMessage = {
            id: localStorage.getItem("IdUser"),
            text,
            date: Date.now(),
          };
          this.ws.send(JSON.stringify({ flag: "message", objMessage }));
          inputMessage.value = "";
        }
      });
  }

  renderMessage({ id, nick, text, date }) {
    const divMessage = document.createElement("div");
    divMessage.classList.add("message");

    const divAutor = document.createElement("div");
    divAutor.classList.add("autor");

    const spanName = document.createElement("span");
    spanName.classList.add("name");
    spanName.textContent = `${nick}`;
    divAutor.append(spanName);

    const spanDate = document.createElement("span");
    spanDate.classList.add("date");
    spanDate.textContent = formatDate(date);
    divAutor.append(spanDate);

    const spanTextMessage = document.createElement("span");
    spanTextMessage.classList.add("text-message");
    spanTextMessage.textContent = text;

    divMessage.append(divAutor);
    divMessage.append(spanTextMessage);
    this.container.querySelector(".message-list").append(divMessage);
    if (id === localStorage.getItem("IdUser")) {
      spanName.textContent = "You ";
      divAutor.style.color = "red";
      divMessage.style.alignSelf = "flex-end";
    }
  }

  renderListMembers(memberList) {
    const ulMembers = this.container.querySelector(".ul-members");
    ulMembers.textContent = "";
    memberList.forEach((item) => {
      const liMember = document.createElement("li");
      liMember.classList.add("li-member");
      liMember.textContent = item.nick;
      ulMembers.append(liMember);
    });
  }
}
