
import { usePersistentChat } from './usePersistentChat';
import { useParams } from 'react-router-dom';

interface LessonContext {
  chapterTitle?: string;
  lessonTitle?: string;
  content?: string;
}

export const useLyraChat = (lessonContext?: LessonContext) => {
  const { chapterId, lessonId } = useParams();
  
  const chapterIdNum = chapterId ? parseInt(chapterId) : 1;
  const lessonIdNum = lessonId ? parseInt(lessonId) : 1;

  return usePersistentChat(lessonIdNum, chapterIdNum, lessonContext);
};
