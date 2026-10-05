import React, {useEffect, useState} from 'react';
import {
    View, 
    Text, 
    TextInput, 
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Funcionario from './models/Funcionario';
import styles from './styles';

export default function Cadastro(){
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [email, setEmail] = useState('');
    const [unidade, setUnidade] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [funcionarios,setFuncionarios] = useState<Funcionario[]>([]);

    useEffect(()=>{
        carregarFuncionarios();
    },[]);

    async function carregarFuncionarios() {
        try{
            const dados = await AsyncStorage.getItem('funcionarios');
            if (dados !== null){
                const lista = JSON.parse(dados);
                setFuncionarios(lista);
            }
        }catch(error){
            console.log('Erro ao carregar funcionarios:',error);
        }
    }

    async function cadastrar(){
        if(nome === '' || matricula === '' || email === '' ||
            unidade === '' || endereco === '' || telefone === '' 
        ){
            Alert.alert('Atenção','Preencha todos os campos');
            return;
        }
        const novoFuncionario = new Funcionario(
            nome,matricula,email,unidade,endereco,telefone
        );
        const novaLista = [...funcionarios,novoFuncionario];

        try{
            await AsyncStorage.setItem
            ('funcionarios',JSON.stringify(novaLista));
            setFuncionarios(novaLista);
            limparCampos();
            Alert.alert('Sucesso','Funcionário cadastrado com sucesso');
        }catch(error){
            console.log('Erro ao salvar funcionários', error);
        }
    }
    function limparCampos(){
        setNome('');
        setMatricula('');
        setEmail('');
        setUnidade('');
        setEndereco('');
        setTelefone('');
    }

    async function excluirFuncionario(index:number) {
        Alert.alert('Excluir', 'Deseja realmente excluir o Funcionário?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text:'Excluir',
                    onPress: async()=>{
                        const novaLista = funcionarios.filter(
                            (_, i) => 1 !== index
                        );
                        setFuncionarios(novaLista);
                        await AsyncStorage.setItem
                        ('funcionarios',JSON.stringify(novaLista));
                    },
                },
            ]
        );
    }

    function renderFuncionario(
        {
            item,
            index,
        }:
        {
            item: Funcionario;
            index: number;
        }
    ){
       return(
        <View style={styles.card}>
            <Text style={styles.cardTitulo}>{item.nome}</Text>
            <Text style={styles.cardTexto}>Matrícula: {item.matricula}</Text>
            <Text style={styles.cardTexto}>E-mail: {item.email}</Text>
            <Text style={styles.cardTexto}>Unidade: {item.unidade}</Text>
            <Text style={styles.cardTexto}>Endereço: {item.endereco}</Text>
            <Text style={styles.cardTexto}>Telefone: {item.telefone}</Text>
            <TouchableOpacity>
                <Text style={styles.botaoExcluir} 
                onPress={()=>excluirFuncionario(index)}>Excluir</Text>
            </TouchableOpacity>
        </View>
       ); 
    }
    //interface

    return(
        <View style={styles.container}>
            <Text style={styles.titulo}>Cadastro de Funcionários</Text>

            <TextInput style={styles.input} placeholder="Nome" value={nome}
            onChangeText={setNome}/>

            <TextInput style={styles.input} placeholder="Matrícula" value={matricula}
            onChangeText={setMatricula} keyboardType='numeric'/>

            <TextInput style={styles.input} placeholder="E-mail" value={email}
            onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>

            <TextInput style={styles.input} placeholder="Unidade Alocada" value={unidade}
            onChangeText={setUnidade}/>

            <TextInput style={styles.input} placeholder="Endereço" value={endereco}
            onChangeText={setEndereco}/>

            <TextInput style={styles.input} placeholder="Telefone" value={telefone}
            onChangeText={setTelefone} keyboardType="phone-pad"/>

            <TouchableOpacity style={styles.botao} onPress={cadastrar}>
                <Text style={styles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>

            <Text style={styles.subtitulo}>Funcionários Cadastrados</Text>

            <FlatList data={funcionarios} keyExtractor={(_,index)=>index.toString()}
                renderItem={renderFuncionario} showsVerticalScrollIndicator={false}/>
        </View>
    );
}