// home page
import HomeLayout from '@/layout/HomeLayout'
import { HomeSubData } from '@/utils/constants';
import HomeHistory from './components/history'
import SettingsLayout from '@/layout/SettingsLayout'
import { useRouter } from 'next/router';
import FileUpload from './components/FileUpload';
import Breadcrumb from '@/components/ui/Breadcrumbs';


function Home() {
  const showTitle = false;
  return (
    <div className='mt-[8rem] h-[100%] rounded-[1rem] bg-sirp-secondary2 mx-5'>
      <HomeLayout>
        <h1 className='text-2xl pl-10 pt-5 mb-10 font-bold'>Add Content</h1>
        <Breadcrumb />
        <FileUpload />
      </HomeLayout>

      <SettingsLayout showTitle={showTitle} data={HomeSubData}>
        <HomeHistory />
      </SettingsLayout>
    </div>

  )
}

export default Home;