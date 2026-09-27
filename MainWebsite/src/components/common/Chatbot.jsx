import { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
} from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 Welcome to GlobalScion Conferences. How can I help you?",
    },
  ]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Temporary bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Thanks for your message! Our team will help you with your conference-related query.",
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* =====================================================
          FLOATING CHAT BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open chatbot"
        className="
          fixed
          bottom-6
          right-6
          z-[9999]
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          shadow-xl
          transition-all
          duration-300
          hover:scale-110
          active:scale-95
        "
        style={{
          backgroundColor: "var(--brand)",
          color: "#ffffff",
        }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={25} />
        )}

        {/* Notification dot */}
        {!isOpen && (
          <span
            className="
              absolute
              right-0
              top-0
              h-3
              w-3
              rounded-full
              border-2
            "
            style={{
              backgroundColor: "#ef4444",
              borderColor: "var(--bg-card)",
            }}
          />
        )}
      </button>

      {/* =====================================================
          CHAT WINDOW
      ====================================================== */}

      {isOpen && (
        <div
          className="
            fixed
            bottom-24
            right-6
            z-[9998]
            flex
            h-[520px]
            w-[360px]
            max-w-[calc(100vw-32px)]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            shadow-2xl
          "
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              px-4
              py-4
            "
            style={{
              backgroundColor: "var(--brand)",
              color: "#ffffff",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white/20
                "
              >
                <Bot size={21} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  GlobalScion Assistant
                </h3>

                <p className="text-xs text-white/80">
                  Online • Ready to help
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                rounded-full
                p-1.5
                transition
                hover:bg-white/10
              "
            >
              <X size={19} />
            </button>
          </div>

          {/* MESSAGES */}

          <div
            className="
              flex-1
              space-y-4
              overflow-y-auto
              p-4
            "
            style={{
              backgroundColor:
                "var(--bg-secondary)",
            }}
          >
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex ${
                  item.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[82%] items-end gap-2 ${
                    item.sender === "user"
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div
                    className="
                      flex
                      h-7
                      w-7
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        item.sender === "user"
                          ? "var(--brand)"
                          : "var(--bg-card)",
                      color:
                        item.sender === "user"
                          ? "#ffffff"
                          : "var(--brand)",
                    }}
                  >
                    {item.sender === "user" ? (
                      <User size={14} />
                    ) : (
                      <Bot size={14} />
                    )}
                  </div>

                  <div
                    className="
                      rounded-2xl
                      px-3
                      py-2.5
                      text-sm
                    "
                    style={{
                      backgroundColor:
                        item.sender === "user"
                          ? "var(--brand)"
                          : "var(--bg-card)",
                      color:
                        item.sender === "user"
                          ? "#ffffff"
                          : "var(--text-primary)",
                      border:
                        item.sender === "bot"
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}

          <div
            className="
              border-t
              p-3
            "
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                px-3
                py-2
              "
              style={{
                borderColor: "var(--border)",
                backgroundColor:
                  "var(--bg-secondary)",
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask something..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-sm
                  outline-none
                "
                style={{
                  color: "var(--text-primary)",
                }}
              />

              <button
                type="button"
                onClick={handleSend}
                className="
                  flex
                  h-9
                  w-9
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  transition
                  hover:opacity-80
                "
                style={{
                  backgroundColor: "var(--brand)",
                  color: "#ffffff",
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;