import EventEmitter from "events";
import { ModalDialogState } from "./types";

class ModalDialogEventEmitter {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  alert = async (content?: ModalDialogState["content"]): Promise<undefined> => {
    this.emitter.emit("openAlert", content);
    return await new Promise(resolve => {
      this.emitter.once("alert", () => {
        resolve(undefined);
      });
    });
  };

  confirm = async (content?: ModalDialogState["content"]): Promise<boolean> => {
    this.emitter.emit("openConfirm", content);
    return await new Promise(resolve => {
      this.emitter.once("confirm", (type: "ok" | "cancel") => {
        if (type === "ok") resolve(true);
        if (type === "cancel") resolve(false);
      });
    });
  };

  prompt = async (
    content?: ModalDialogState["content"]
  ): Promise<undefined> => {
    this.emitter.emit("openPrompt", content);
    return await new Promise(resolve => {
      this.emitter.once("prompt", (type: "ok" | "cancel", text: string) => {
        if (type === "ok") resolve(text);
        if (type === "cancel") resolve(null);
      });
    });
  };

  clickAlert = () => {
    this.emitter.emit("alert");
  };

  clickConfirm = (type: "ok" | "cancel") => {
    this.emitter.emit("confirm", type);
  };

  clickPrompt = (type: "ok" | "cancel", text: string) => {
    this.emitter.emit("prompt", type, text);
  };

  addEventListener = (
    type: "openAlert" | "openConfirm" | "openPrompt",
    callback: (content?: ModalDialogState["content"]) => void
  ) => {
    this.emitter.addListener(type, callback);
  };

  removeEventListener = (
    type: "openAlert" | "openConfirm" | "openPrompt",
    callback: (content?: ModalDialogState["content"]) => void
  ) => {
    this.emitter.removeListener(type, callback);
  };
}

export const ModalDialog = new ModalDialogEventEmitter();
