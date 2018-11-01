import * as React from 'react';
import emotion from 'react-emotion';
import GroupCard from './GroupCard';
import ConfigoCombo from './ConfigoCombo';
const cpuIcon = require('./images/cpu.svg');
const cmIcon = require('./images/cm.svg');

export default class Configurateur extends React.Component {
  render() {
    return (
      <Container>
        <ConfigoContainer>
          <GroupCard title="Les composants" gridArea="compos">
            <ConfigoCombo title="Le Processeur" icon={cpuIcon} />
            <ConfigoCombo title="La carte mère" icon={cmIcon} />
          </GroupCard>
          <GroupCard title="L'OS & le montage" gridArea="system">
            <ConfigoCombo title="La carte mère" icon={cmIcon} />
          </GroupCard>
          <GroupCard title="Les périphériques" gridArea="periphs">
            <ConfigoCombo title="Le Processeur" icon={cpuIcon} />
          </GroupCard>
          <GroupCard title="La connectique et le modding" gridArea="modding">
            <ConfigoCombo title="Le Processeur" icon={cpuIcon} />
          </GroupCard>
        </ConfigoContainer>
      </Container>
    );
  }
}

const Container = emotion('div')({
  width: '100%',
  display: 'grid',
  gridGap: '25px',
  position: 'relative',
  margin: '0 auto 20px',
  gridTemplateColumns: '1fr 26%',
  fontSize: '1em'
});

const ConfigoContainer = emotion('div')({
  width: '100%',
  display: 'grid',
  gridTemplateAreas: '"compos system" "compos periphs" "compos modding"',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridGap: '25px',
  position: 'relative',
  margin: '0 auto 25px',
  backgroundColor: '#EDF1F2'
});
