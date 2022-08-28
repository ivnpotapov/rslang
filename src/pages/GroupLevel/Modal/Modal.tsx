import styles from './Modal.module.css';
import ReactAudioPlayer from 'react-audio-player';
import { IModal } from '../../../utils/constants';
import { api, EApiParametrs } from '../../../utils/Api';
import { useSelector } from 'react-redux';
import { TState } from '../../../store/store';
import { Button } from '../../../components/UI/Button/Button';

export const Modal = ({ modal, setModal, word }: IModal) => {
  const token = useSelector((state: TState) => state.auth.currentUser.token);
  const userId = useSelector((state: TState) => state.auth.currentUser.userId);

  const rootClasses = [styles.Modal];
  if (modal) {
    rootClasses.push(styles.active);
  }

  const isLodined = useSelector((state: TState) => state.auth.isLogined);

  async function sendHardWord() {
    if (!word) {
      return;
    }

    try {
      await api.addHardWord({ userId, token, word });
    } catch (error) {
      console.error(error);
    }
  }

  function sendLearnWord() {
    console.log('добавлено в изученные');
  }

  return (
    <div className={rootClasses.join(' ')} onClick={() => setModal(false)}>
      <div className={styles.ModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_main}>
          <h1>{word?.word}</h1>
          <p>{word?.transcription}</p>
          <h3>{word?.wordTranslate}</h3>
          {word?.image ? <img src={`${EApiParametrs.baseUrl}/${word?.image}`} alt="" /> : null}
        </div>
        <div className={styles.modal_examples}>
          <div className={styles.modal_example}>
            <p>{word?.textExample}</p>
            <p>{word?.textExampleTranslate}</p>
            {word?.audioExample ? (
              <ReactAudioPlayer src={`${EApiParametrs.baseUrl}/${word?.audioExample}`} controls />
            ) : null}
          </div>
          <div className={styles.modal_example}>
            <p>{word?.textMeaning}</p>
            <p>{word?.textMeaningTranslate}</p>
            {word?.audioMeaning ? (
              <ReactAudioPlayer src={`${EApiParametrs.baseUrl}/${word?.audioMeaning}`} controls />
            ) : null}
          </div>
          {isLodined ? (
            <div>
              <button onClick={sendHardWord}>Сложные слова</button>
              <Button value={'Изучено'} func={sendLearnWord} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
