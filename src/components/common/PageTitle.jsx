import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'

const PageTitle = ({title, showBack, productTitle}) => {
    const navigate = useNavigate()

    if (productTitle) {
        return (
            <div className='text-[20px] font-semibold mb-5'>
                {showBack && <ArrowLeftOutlined onClick={() => navigate(-1)} className='inline-block align-middle mr-5' />}
                <h1 className='inline-block align-middle'>
                    {title}&nbsp;
                    {productTitle ? <span className='text-[#214093]'>{productTitle}</span> : ''}
                </h1>
            </div>
        )
    }
    
    return (
        <div className='text-[20px] font-semibold mb-5'>
            {showBack && <ArrowLeftOutlined onClick={() => navigate(-1)} className='inline-block align-middle mr-5' />}
            <h1 className='inline-block align-middle'>{title}</h1>
        </div>
    );
}
 
export default PageTitle;