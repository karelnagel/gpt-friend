import type { Session } from "next-auth";

export const App = ({ session }: { session: Session }) => {
  return (
    <div className="grid h-screen w-screen grid-cols-4">
      <p>Start new conversation</p>
    </div>
  );
};
