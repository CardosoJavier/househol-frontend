export default function VerifyEmail() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="fflex flex-col gap-5 outline outline-secondary p-5 rounded-md min-w-80 max-w-96">
        <div className="flex flex-col gap-4">
          <h1 className="text-accent font-bold text-2xl">Check your email!</h1>
          <p className="text-gray-500 text-sm">
            We sent an email with a link to activate your account. Check your
            inbox and click on 'verify account' to start managing your tasks
          </p>
        </div>
      </div>
    </div>
  );
}
