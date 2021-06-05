import React, { useEffect, useState } from 'react';
import GroupRepository, { Group } from 'libs/GroupRepository';



interface LoadGroupProps {
  groupRepository: GroupRepository,
  render: (param: {group: Group|null}) => JSX.Element,
};

const LoadGroup = ({groupRepository, render}: LoadGroupProps) => {
  const [group, setGroup] = useState<Group|null>(null);

  useEffect(()=>{
    groupRepository.getGroup().then(setGroup).catch(()=>console.error("Fail to load"));
  }, [groupRepository]);

  return render({group});
};

export default LoadGroup;
 