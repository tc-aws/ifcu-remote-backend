// export const pubMsg = {
//   payload: {},
//   pack: (code: any) => {
//     pubMsg.payload = { code };
//     return pubMsg;
//   },
//   toString: () => {
//     return JSON.stringify(pubMsg);
//   },
// };

export function PubMsg(msg: object) {
  this.payload = { msg };
  this.toString = function () {
    return JSON.stringify(this.payload);
  };
}

export const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
