export enum Progress {
  Pending = 'Pending', // 답변 기다리는 중
  Pick = 'Pick', //유저선택 => 결제 대기중
  Proceeding = 'Payment', //결제 완료 => 작업 시작
  Submit = 'Submit', //작업물 제출 => 등록유저 완료 대기중
  Clear = 'Clear', // 캐쉬 전달 => clear
}
