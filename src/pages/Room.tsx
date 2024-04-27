import { FormEvent, useEffect, useState } from "react";

import client, {
  COLLECTION_ID_MESSAGES,
  DATABASE_ID,
  databases,
} from "../appwriteConfig";
import {
  ID,
  Models,
  Query,
  RealtimeResponseEvent,
  Role,
  Permission,
} from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

export interface IAppProps {}

export const Room = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Models.Document[]>([]);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response: RealtimeResponseEvent<any>) => {
        // Callback will be executed on changes for documents A and all files.

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setMessages((prevState) => [response.payload, ...prevState]);
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    setMessageBody("");

    const permissions: string[] | undefined = [
      Permission.write(Role.user(user.$id)),
    ];

    await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permissions
    );
  };

  const getMessages = async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc("$createdAt")]
    );

    setMessages(response.documents);
  };

  const deleteMessage = async (messageId: string) => {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      messageId
    );
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              required
              maxLength={1000}
              placeholder="Say something!"
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            />
          </div>
          <div className="btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>

        <div className="messages-area">
          {messages.map((message) => (
            <div className="message--wrapper" key={message.$id}>
              <div className="message--header">
                <p>
                  {message?.username ? (
                    <span>{message.username}</span>
                  ) : (
                    <span>Anonymous User</span>
                  )}
                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>

                {message.$permissions.includes(
                  `delete(\"user:${user.$id}\")`
                ) && (
                  <Trash2
                    className="delete--btn"
                    onClick={() => {
                      deleteMessage(message.$id);
                    }}
                  />
                )}
              </div>
              <div className="message--body">
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
