export enum ResponseCode {
  SUCCESS = '0',
  RECORD_NOT_FOUND = '',
}

export const ResponseMessage: Record<ResponseCode, string> = {
  [ResponseCode.SUCCESS]: 'Success',
  [ResponseCode.RECORD_NOT_FOUND]: 'No encontrado',
};

//EJEMPLO DE USO
// console.log(ResponseMessage[ResponseCode.ParameterError])
