import ModRecentComments from './ModRecentComments';
import ModRecentLikes from './ModRecentLikes';

export default function ModeratorTask() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <h1 className="text-xl bold text-slate-400">Recent likes</h1>
        <ModRecentLikes />
      </div>
      <div>
        <h1 className="text-xl bold text-slate-400">Recent comments</h1>
        <ModRecentComments />
      </div>
    </div>
  );
}
