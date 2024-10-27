package au.edu.sydney.elec5619.tue0508g2.project.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.*;
import org.springframework.boot.test.context.TestComponent;


@TestComponent
public class JSONHelper {

    public static class EasyJSON{

        public EasyJSON(){
            ObjectMapper mapper = new ObjectMapper();
            root = mapper.createObjectNode();
        }

        public EasyJSON streamPut(String name, String value){
            root.set(name, new TextNode(value));
            return this;
        }

        public EasyJSON streamPut(String name, int value){
            root.set(name, new IntNode(value));
            return this;
        }

        public EasyJSON streamPut(String name, float value){
            root.set(name, new FloatNode(value));
            return this;
        }

        public EasyJSON streamPut(String name, EasyJSON sub){
            root.set(name, sub.root);
            return this;
        }

        public EasyJSON streamPut(String name, boolean value){
            root.set(name, BooleanNode.valueOf(value));
            return this;
        }

        public boolean check(String name, String value){
            return root.get(name).toString().equals(value);
        }

        @Override
        public String toString() {
            return root.toString();
        }

        public final ObjectNode root;

    }

}
