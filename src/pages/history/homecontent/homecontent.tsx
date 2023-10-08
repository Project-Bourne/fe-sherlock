import React, { useState } from 'react';
import ActionIcons from '../../home/components/actionIcons/ActionIcons';
import Image from 'next/image';
import BreadCrum from '../../home/components/BreadCrum';
import Min_and_Max_icon from '../../home/components/Min_Max_icon';
import DummyText from '../../home/components/dummyText';
import Link from 'next/link';
import { useSelector } from 'react-redux';

function homecontent() {
  const [hideMeta, setHideMeta] = useState(true);

  const {  analyzedUuid } = useSelector(
    (state: any) => state.analyze
  );
  const handleMax = () => {
    setHideMeta(true);
  };
  const handleMin = () => {
    setHideMeta(false);
  };
  return (
    <div className="bg-sirp-secondary2 h-[100%] mx-5 rounded-[1rem]">
      <div className="flex md:justify-between flex-wrap px-5 py-5 ">
        <div className="">
          <Link href="../">
            <Image
              src={require('../../../../public/icons/arrow-narrow-left 1.svg')}
              alt="documents"
              className="cursor-pointer pb-5"
              width={20}
            />
          </Link>
          {/* the name goes here  */}
          <h1 className="text-2xl">Peter Duru</h1>
        </div>
        {/* all icons with modal  */}
        <ActionIcons docId={analyzedUuid} />
      </div>
      {/* breadcrum section  */}
      <BreadCrum />
      {/* min and max */}
      <div className="bg-white border my-10 mx-10 rounded-[1rem]">
        <Min_and_Max_icon maxOnClick={handleMax} minOnClick={handleMin} />
        {hideMeta == true && (
          <div className="pl-5 my-5">
            <p className="text-md text-gray-500">Title</p>
            <h1 className="md:text-3xl text-[14px]">
              Specific Conditions or Instruction
            </h1>
          </div>
        )}
      </div>
      <div className="my-10 mx-5">
        <DummyText />
      </div>
    </div>
  );
}

export default homecontent;
