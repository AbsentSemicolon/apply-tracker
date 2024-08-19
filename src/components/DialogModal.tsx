import { useEffect, useRef } from "react";

const DialogModal = ({ children, isOpened, closeModal, title }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (isOpened) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpened]);

    return (
        <dialog
            ref={dialogRef}
            onClose={closeModal}
            className="backdrop:backdrop-blur-sm p-2 rounded"
        >
            <div className="flex justify-between border-b-2 pb-2 mb-4">
                <p className="font-bold text-2xl">{title}</p>
                <button
                    onClick={closeModal}
                    className="pl-5 text-lg"
                >
                    &#x2716;
                </button>
            </div>
            {isOpened && children}
        </dialog>
    );
};

export default DialogModal;
