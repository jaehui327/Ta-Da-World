import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { changeTreasure } from '../../../stores/watch';
import tw from 'tailwind-styled-components';
import { Modal, ModalSection, ModalHeader } from '../../../utils/Semantics';
import { BsX }  from 'react-icons/bs';
import Swal from 'sweetalert2';
import { TreasureInfo } from '../../../utils/Interfaces';
import TreasureInfoBox from '../../common/TreasureInfoBox';
import useApi from '../../../hooks/useApi';

interface openProps {
	open: boolean;
	close: () => void;
	treasure: TreasureInfo | null;
}

interface StyledDivProps {
	active: string;
}

const DynamicModal = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
	`}
`;

function ListModal({ open, close, treasure }: openProps): JSX.Element{
	const dispath = useDispatch();
	const deleteApi = useApi();

	useEffect(()=>{
		if(deleteApi.data?.success){
			dispath(changeTreasure(-1));
			Swal.fire({          
				width: 300,
				iconColor: '#2BDCDB',
				html: '보물 삭제 성공!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
			close();
		}	
	}, [deleteApi.data]);

	const deleteTreasure  = (): void  => {
		deleteApi.fetchNotBodyApiWithToken('DELETE', `/treasures/${treasure?.id}`);
	};
	
	return (
		<DynamicModal active = {open ? '1':''}>
			{open ? (
				<ModalSection>
					<ModalHeader>
						<div>
							보물 정보
						</div>
						<BsX onClick={()=> {close();}} size="32" color="#535453"/>
					</ModalHeader>
					<div className='flex flex-col items-center overflow-y-scroll'>
						{treasure ?
							<TreasureInfoBox isHost={true} treasure={treasure} />
							: null
						}
						<div className='flex justify-end w-full mb-2 text-main' onClick={deleteTreasure}>보물 삭제하기</div>
					</div>
				</ModalSection>
			) : null}
		</DynamicModal>
	);
}

export default ListModal;
